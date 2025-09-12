import { z } from "zod";

export const formVacancySchema = z.object({
  batch: z.string().min(1, "Batch is Required"),
  role: z.string().min(1, "Role is Required"),
  skills: z.array(z.object({
    priority: z.number().nonnegative().nonoptional(),
    skillName: z.string().nonempty()
  })).min(1, "Skills is Required")
});

export const formBatchSchema = z.object({
  batchName: z.string().min(5, "Batch Name is required"),
  batchStartDate: z.date() ,
  batchStartTime: z.string(),
  batchEndDate: z.date(),
  batchEndTime: z.string()
});
export const formRoleSchema = z.object({
  roleTitle: z.string().min(1, "Role is Required"),
  roleDescription: z.string().min(5, "Description is Required"),
});

export const formTeamInviteSchema = z.object({
  email: z.email().nonempty("Email is Required!"),
  role: z.string().nonempty("Role is Required!")
})
