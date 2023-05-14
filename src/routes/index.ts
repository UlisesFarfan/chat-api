// src/routes/index.ts
import { Router } from 'express';

import { readdirSync } from 'fs';

import { cleanFileName } from '../utils/cleanFile';

const router = Router();

const PATH_ROUTER = `${__dirname}`;

readdirSync(PATH_ROUTER).filter(fileName => {

  const cleanName: string | undefined = cleanFileName(fileName);

  if (cleanName !== 'index') {
    import(`./${cleanName}.routes`).then(modelRouter => {
      console.log('Route ->', cleanName)
      router.use(`/${cleanName}`, modelRouter.router);
    });
  }

});




export default router;
