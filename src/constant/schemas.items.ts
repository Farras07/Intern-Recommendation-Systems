import { z } from 'zod';

export const formVacancySchema = z.object({
  batch: z.string().min(1, 'Batch is Required'),
  role: z.string().min(1, 'Role is Required'),
  skills: z
    .array(
      z.object({
        priority: z.number().nonnegative().nonoptional(),
        skillName: z.string().nonempty(),
      }),
    )
    .min(1, 'Skills is Required'),
});

export const formBatchSchema = z.object({
  batchName: z.string().min(5, 'Batch Name is required'),
  batchStartDate: z.date(),
  batchStartTime: z.string(),
  batchEndDate: z.date(),
  batchEndTime: z.string(),
});
export const formRoleSchema = z.object({
  roleTitle: z.string().min(1, 'Role is Required'),
  roleDescription: z.string().min(5, 'Description is Required'),
});

export const formTeamInviteSchema = z.object({
  email: z.email().nonempty('Email is Required!'),
  role: z.string().nonempty('Role is Required!'),
});

export const formVacancyFilterSchema = z.object({
  role: z.string(),
  batch: z.string(),
});

export const formRoleQVacancySchema = z.object({
  vacancy_2: z.string(),
});

export const formGeneralQVacancySchema = z.object({
  name: z.string().nonempty('Name is Required!'),
  email: z.email().nonempty('Email is Required!'),
  cv: z
    .url({ message: 'Curriculum Vitae link must be a valid URL!' })
    .refine(val => val.startsWith('https://'), {
      message: 'Curriculum Vitae link must start with https://',
    })
    .optional(),
  educationInstitution: z.string().nonempty('Education is Required!'),
  phone: z.string().nonempty('Phone is Required!'),
});

export const formSkillsQVacancySchema = z.object({
  skills: z.array(
    z.object({
      exp: z.string().nonempty('Experience is required!'),
      skillRate: z.array(
        z.object({
          skillName: z.string().nonempty({ message: 'Skillname is required!' }),
          rate: z.string().nonempty({ message: 'rate of skill is required!' }),
        }),
      ),
      portofolioLink: z
        .url({ message: 'Portfolio must be a valid URL!' })
        .refine(val => val.startsWith('https://'), {
          message: 'Portfolio link must start with https://',
        })
        .optional(),
      achievement: z.object({
        lvlRate: z.string().optional(),
        champRate: z.string().optional(),
        cert: z
          .url({ message: 'Achievement certificate link must be a valid URL!' })
          .refine(val => val.startsWith('https://'), {
            message: 'Achievement certificate link must start with https://',
          })
          .or(z.literal(''))
          .optional(),
        // cert: z.instanceof(File, { message: "Certificate is required!" })
        //   .refine((file) => file.type === "application/pdf", {
        //     message: "Only PDF files are allowed!",
        //   })
        //   .optional(),
      }),
    }),
  ),
});
