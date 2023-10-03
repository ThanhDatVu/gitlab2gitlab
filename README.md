## Overview

* This is a sample using bull in NestJS.

## System requirements

* Docker
* Docker Compose
* Redis
* Node.js - 10.x
* Yarn - 1.17.x

## Used library

* @nestjs/core - 6.7.x
* @nestjs/bull - 0.0.1
* bull - 3.12.1

## Usage

### 1. Download Sample

```bash
git clone git@github.com:yasu-s/nestjs-bull-sample.git
```

### 2. Installing packages  

```bash
cd nestjs-bull-sample
yarn install
```

### 3. Redis start 

```bash
docker-compose up -d
```

### 4. Launch sample application

```bash
yarn start
```

## Reference URL

* https://docs.nestjs.com/techniques/queues
