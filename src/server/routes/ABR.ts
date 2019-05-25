import * as Express from 'express';
import { Request, Response } from 'express';
import axios from 'axios';

const abrCode = 'd775bcee-a0ba-4bb0-aee7-62b971918436';

const cache: any = {};

export const ABR = (app: Express.Application) => {
  const fromJsonP = (jsonpData: string) => {
    var startPos = jsonpData.indexOf('({');
    var endPos = jsonpData.indexOf('})');
    var jsonString = jsonpData.substring(startPos + 1, endPos + 1);
    return JSON.parse(jsonString);
  };
  app.get('/abr/names', (req: Request, res: Response) => {
    if (cache[req.query.name]) {
      res.status(200).json(cache[req.query.name]);
      return;
    }

    axios
      .get('https://abr.business.gov.au/json/MatchingNames.aspx', {
        params: {
          maxResults: req.query.maxResults,
          guid: abrCode,
          name: req.query.name,
        },
      })
      .then((result) => {
        let data = fromJsonP(result.data);
        console.log(data);
        res.status(200).json(data);
      })
      .catch((err) => {
        res.status(400).json(JSON.parse(err));
      });
  });

  app.get('/abr/abn', (req: Request, res: Response) => {
    if (cache[req.query.abn]) {
      res.status(200).json(cache[req.query.abn]);
      return;
    }

    axios
      .get('https://abr.business.gov.au/json/AbnDetails.aspx', {
        params: {
          maxResults: req.query.maxResults,
          guid: abrCode,
          abn: req.query.abn,
        },
      })
      .then((result) => {
        let data = fromJsonP(result.data);
        console.log(data);
        res.status(200).json(data);
      })
      .catch((err) => {
        res.status(400).json(JSON.parse(err));
      });
  });
};
