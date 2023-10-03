import { Body, Controller, Get, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { Gitlab } from '@gitbeaker/rest';

const sourceApi = new Gitlab({
  token: 'glpat-cUKXvpHhrAPRexp5j4mx',
});

const desApi = new Gitlab({
  token: 'glpat-cUKXvpHhrAPRexp5j4mx',
});

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('bull_test')
  async bullTest(
    @Query('source') source: string,
    @Query('des') des: string,
  ) {
    try {
      //find source project
      const project = await sourceApi.Projects.all({
        owned: true,
      });

      const sourceProject = project.find(p => p.path_with_namespace === source);

      //find des project
      const projectDes = await desApi.Projects.all({
        owned: true,
      });

      const desProject = projectDes.find(p => p.path_with_namespace === des);

      if (!sourceProject || !desProject) {
        return 'Project not found';
      }

      //get all issues from source project
      const issues = await sourceApi.Issues.all({
        projectId: sourceProject.id,
      });

      console.log("issues", issues);

      console.log("issues", issues.length);


      // //create issues in des project
      const promises = issues.map(async issue => {
        const newIssue = await desApi.Issues.create(desProject.id, issue.title, {
          description: issue.description,
          labels: issue.labels[0],
        });

        const comments = await sourceApi.IssueNotes.all(sourceProject.id, issue.iid);

        const commentPromises = comments.map(async comment => {
          await desApi.IssueNotes.create(desProject.id, newIssue.iid, comment.body);

          // //download image
          // const images = comment.body.match(/!\[.*\]\((.*)\)/g);

          // //upload image
          // const imagePromises = images.map(async image => {
          //   const url = image.match(/\((.*)\)/)[1];
          //   const fileName = url.split('/').pop();
          //   const file = await sourceApi.RepositoryFiles.show(sourceProject.id, url, 'master');

          //   await desApi.RepositoryFiles.create(
          //     desProject.id,
          //     `images/${fileName}`,
          //     'master',
          //     file.content,
          //     'update image',
          //   );
          // });
        });

        return newIssue;
      });

      return this.appService.addQueue();
    } catch (e) {
      console.log(e);
    }
    return 'done';
  }

  @Get('state/:id')
  getJobState(@Param('id') id: string) {
    return this.appService.getState(Number(id));
  }
}
