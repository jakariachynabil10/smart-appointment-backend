import { Request, Response } from "express";
import { appointmentService } from "./appointment.service";

const createAppointment = async (req: Request, res: Response) => {
  try {
    const result = await appointmentService.createAppointment(req);
    res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getUserAppointments = async (req: Request, res: Response) => {
  try {
    const result = await appointmentService.getUserAppointments(req.params.id);
    res.status(200).json({
      success: true,
      message: "User appointments fetched successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateAppointmentStatus = async (req: Request, res: Response) => {
  try {
    const result = await appointmentService.updateAppointmentStatus(req);
    res.status(200).json({
      success: true,
      message: "Appointment status updated successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const appointmentController = {
  createAppointment,
  getUserAppointments,
  updateAppointmentStatus,
};
