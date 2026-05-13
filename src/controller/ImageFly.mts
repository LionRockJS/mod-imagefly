import {stat, mkdir} from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import {ControllerMixinMime, ControllerMixinView, Controller, Central} from "@lionrockjs/central";

export default class ControllerImageFly extends Controller{
  static mixins = [...Controller.mixins, ControllerMixinMime, ControllerMixinView];

  async action_index(){
    const {options, "*": source} = this.request.params;
    const resultFile = '/media/cache/'+options+'/'+source;
    const targetFile = path.normalize(Central.APP_PATH+'/../public'+resultFile);
    const sourceFile = path.normalize(Central.APP_PATH+'/../public/'+ source);
    //check target file exist;
    try{
      const exist = await stat(targetFile);
      //file exist, redirect to image file;
      await this.redirect(resultFile, true);
    }catch(err){
      if(err.code === 'ENOENT'){
        //target not exist
      }else{
        throw err;
      }
    }

    //check source exist
    await stat(sourceFile);

    //not exist, prepare transform image
    const width    = options.match(/w(\d+)/i);
    const height   = options.match(/h(\d+)/i);
    const fit      = options.match(/(cover|contain|fill|inside|outside)/i);
    const position = options.match(/[^-](top|right top|right|right bottom|bottom|left bottom|left|left top)[$-]/i);
    const gravity  = options.match(/[^-](north|northeast|east|southeast|south|southwest|west|northwest|center|centre)[$-]/i);
    const strategy = options.match(/[^-](entropy|attention)[$-]/i);

    if(!width && !height)throw new Error('Please specify width or height');

    const resizeOption = {};
    if(width)resizeOption.width = parseInt(width[1]);
    if(height)resizeOption.height = parseInt(height[1]);
    if(fit)resizeOption.fit = sharp.fit[fit[1]];
    if(position || gravity || strategy){
      resizeOption.position =
        position ? sharp.position[position[1]] :
        gravity ? sharp.gravity[gravity[1]] :
        strategy ? sharp.strategy[strategy[1]] : null;
    }

    const targetDirectory = path.dirname(targetFile);
    //create folder if not exist
    try{
      await stat(targetDirectory)
    }catch(err){
      if(err.code === 'ENOENT'){
        await mkdir(targetDirectory, {recursive: true});
      }else{
        throw err;
      }
    }

    await sharp(sourceFile)
      .resize(resizeOption)
      .toFile(targetFile);

    await this.redirect(resultFile, true);
  }
}