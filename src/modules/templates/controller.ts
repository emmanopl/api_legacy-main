import { NextFunction, Response, Request } from "express";
import Service from "./service";
import awsService from "../../services/aws";
import ImageRenderer from "@scenify/renderer";
import { getUserIdFromRequest } from "../../utils/token";

class TemplatesHandler {
  private service: Service;
  constructor() {
    this.service = new Service();
    this.get = this.get.bind(this);
    this.create = this.create.bind(this);
    this.getById = this.getById.bind(this);
    this.update = this.update.bind(this);
    this.remove = this.remove.bind(this);
    this.downloadById = this.downloadById.bind(this);
  }

  public async get(req: Request, res: Response, next: NextFunction) {
    try {
      let userId = await getUserIdFromRequest(req);
      const templates = await this.service.get({ userId });
      return res.send(templates);
    } catch (err) {
      next(err);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const template = await this.service.getById(id);
      return res.send(template);
    } catch (err) {
      next(err);
    }
  }

  public async downloadById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const template = await this.service.getById(id);

      const imageRenderer = new ImageRenderer(template);
      const image = await imageRenderer.toDataURL({});

      const imageURL = await awsService.uploadBase64Image({ image: image });
      return res.send(imageURL);
    } catch (err) {
      next(err);
    }
  }

  public async download(req: Request, res: Response, next: NextFunction) {
    try {
      const template = req.body;

      const imageRenderer = new ImageRenderer(template);
      const image = await imageRenderer.toDataURL({});
      const imageURL = await awsService.uploadBase64Image({ image: image });

      return res.send({ source: imageURL });
    } catch (err) {
      console.log("err", err);
      next(err);
    }
  }

  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      let userId = await getUserIdFromRequest(req);
      const imageRenderer = new ImageRenderer(data);
      const image = await imageRenderer.toDataURL({});
      const imageURL = await awsService.uploadBase64Image({ image: image });
      const template = await this.service.create({
        ...data,
        ...(userId && { userId }),
        preview: imageURL,
      });
      return res.send(template);
    } catch (err) {
      next(err);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const data = req.body;
      const imageRenderer = new ImageRenderer(data);
      const image = await imageRenderer.toDataURL({});
      const imageURL = await awsService.uploadBase64Image({ image: image });
      await this.service.update(id, {
        ...data,
        preview: imageURL,
      });

      const updatedTemplate = await this.service.getById(id);
      return res.send(updatedTemplate);
    } catch (err) {
      next(err);
    }
  }

  public async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const template = await this.service.remove(id);
      return res.send(template);
    } catch (err) {
      next(err);
    }
  }
}

export default TemplatesHandler;
