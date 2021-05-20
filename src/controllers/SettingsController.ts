import { Request, Response } from "express";
import { SettingsService } from "../services/SettingsService";
class SettingsController {
  async create(request: Request, response: Response) {
    const { chat, username } = request.body;

    // Settings service
    const settingsService = new SettingsService();

    try {
      const settings = await settingsService.create({ chat, username });

      return response.json(settings);
    } catch (err) {
      return response.status(400).json({
        message: err.message,
      });
    }
  }

  async findByUserName(request: Request, response: Response) {
    const { username } = request.params; //parâmetros de rotas

    const settingsService = new SettingsService();

    const settings = await settingsService.findByUserName(username);

    return response.json(settings);
  }
}

export { SettingsController };
