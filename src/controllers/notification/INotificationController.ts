import { Request, Response } from "express";
export interface INotificationController{
    getNotificationsForUser(req: Request, res: Response): Promise<void> ;
    markNotificationAsReadForUser(req: Request, res: Response): Promise<void>;
    clearNotificationsForUser(req: Request, res: Response): Promise<void>;
    getNotificationsForExpert(req: Request, res: Response): Promise<void>;
    markNotificationAsReadForExpert(req: Request,res: Response): Promise<void>;
    clearNotificationsForExpert(req: Request,res: Response): Promise<void>;   
}