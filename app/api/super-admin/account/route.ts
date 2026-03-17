import prisma from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";


// POST: create the super admin object from the userid.