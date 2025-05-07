import { Request, Response } from "express";
import createHttpError, { HttpError } from "http-errors";
import { UserService } from "../services/UserService.js";
import { ConflictException, NotFoundException } from "../base/Exceptions.js";
import { User } from "../models/User.js";
