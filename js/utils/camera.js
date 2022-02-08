// GoProHacks https://github.com/KonradIT/goprowifihack
import _ from 'lodash';
import {CAMARA_IP, CAMARA_PORT, CAMARA_PASSWORD} from '../constants';
import {ProcessingManager} from 'react-native-video-processing';
import Logger from './Logger';
import RNFS from 'react-native-fs';

export const delay = millis => {
  return (...args) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(...args);
      }, millis);
    });
};

export const startRecording = () => {
  Logger.addLog(`start recording at: ${new Date()}`);
  return fetch(`http://${CAMARA_IP}/bacpac/SH?t=${CAMARA_PASSWORD}&p=%01`);
};

export const stopRecording = () => {
  Logger.addLog(`stop recording at: ${new Date()}`);
  return fetch(`http://${CAMARA_IP}/bacpac/SH?t=${CAMARA_PASSWORD}&p=%00`);
};

export const deleteAllFromCamara = () => {
  Logger.addLog('delete all files from camera');
  return fetch(`http://${CAMARA_IP}/camera/DA?t=${CAMARA_PASSWORD}`);
};

export const deleteFromCache = filepath => {
  Logger.addLog(`deleteFromCache ${filepath}`);
  return RNFS.unlink(filepath);
};

export const deleteVideo = video => {
  Logger.addLog(`delete video ${video}`);
  return fetch(
    `http://${CAMARA_IP}/camera/DF?t=${CAMARA_PASSWORD}&p=%15113GOPRO/${video}`,
  );
};

export const getLastVideoURL = () => {
  Logger.addLog(`fetching video list from camera`);
  return fetch(`http://${CAMARA_IP}:${CAMARA_PORT}/gp/gpMediaList`)
    .then(response => response.json())
    .then(jsonResponse => {
      const videoName = _.chain(jsonResponse.media)
        .find(mediaObj => mediaObj.d === '113GOPRO')
        .get('fs')
        .last()
        .get('n')
        .value();

      Logger.addLog(
        `last video url: http://${CAMARA_IP}:${CAMARA_PORT}/videos/DCIM/113GOPRO/${videoName}`,
      );
      return `http://${CAMARA_IP}:${CAMARA_PORT}/videos/DCIM/113GOPRO/${videoName}`;
    });
};

// returns the duration of the video as float
export const getVideoDuration = async videoURL => {
  Logger.addLog(`getting video duration`);
  // getVideoDurationInSeconds(
  //   'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4',
  // ).then(duration => {
  //   console.log(duration);
  // });
  // const retorno = await ProcessingManager.getVideoInfo(videoURL).then(
  //   ({duration}) => duration,
  // );
  // console.log({retorno});
  debugger;
  return null;
};

// returns the path of the result file
export const trimVideo = (videoURL, startTime, endTime) => {
  Logger.addLog(`trimming ${videoURL}, from ${startTime}s to ${endTime}s`);
  return ProcessingManager.trim(videoURL, {
    startTime,
    endTime,
    saveToCameraRoll: true,
  });
};
