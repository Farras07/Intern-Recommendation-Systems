import { z } from 'zod';

export const formVacancySchema = z.object({
  batch: z.string().min(1, 'Batch is Required'),
  role: z.string().min(1, 'Role is Required'),
  skills: z
    .array(
      z.object({
        priority: z
          .number()
          .nonnegative({ message: 'Negative priority is not allowed' })
          .nonoptional({ message: 'priority is Required' }),
        skillName: z.string().nonempty({ message: 'SkillName is Required' }),
      }),
    )
    .min(1, 'Skills is Required')
    .superRefine((skills, ctx) => {
      const seen = new Map<string, number[]>();

      skills.forEach((s, idx) => {
        const name = s.skillName.toLowerCase().trim();
        if (!seen.has(name)) {
          seen.set(name, [idx]);
        } else {
          seen.get(name)?.push(idx);
        }
      });

      for (const [name, indexes] of seen.entries()) {
        if (indexes.length > 1) {
          indexes.forEach(i =>
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Duplicate skill "${name}"`,
              path: [i, 'skillName'], // highlight the specific input
            }),
          );
        }
      }
    }),
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
  verified: z.boolean().optional(),
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
      }),
    }),
  ),
});

export const formInterviewSchema = z.array(
  z.object({
    idVacancy: z.string().nonempty({ message: 'Id Vacancy is required!' }),
    interviewRate: z.string().nonempty({ message: 'Interview is required!' }),
  }),
);

export const formUpdateGeneralVacancySchema = z.object({
  name: z.string().optional(),
  educationInstitution: z.string().optional(),
  phone: z.string().optional(),
});

export const optionalHttpsUrl = z
  .string()
  .trim()
  .optional()
  .refine(val => !val || val.startsWith('https://'), {
    message: 'URL must start with https://',
  })
  .refine(val => !val || /^https?:\/\/.+/.test(val), {
    message: 'Must be a valid URL',
  });

export const formUpdateSkillVacancySchema = z.object({
  vacancy: z.array(
    z.object({
      id: z.string().optional(),
      exp: z.string().optional(),

      skills: z.array(
        z.object({
          skillName: z.string().optional(),
          rate: z.string().optional(),
        }),
      ),

      portofolioLink: optionalHttpsUrl,

      achievement: z.object({
        lvlRate: z.string().optional(),
        champRate: z.string().optional(),
        cert: optionalHttpsUrl,
      }),
    }),
  ),
});

export const formShortlistCandidates = z.object({
  candidateAmount: z
    .number({
      required_error: 'Candidate Amount is required!',
      invalid_type_error: 'Field value must be a number!',
    } as any)
    .min(1, { message: 'Candidate Amount must be greater than 0!' }),

  interviewDate: z.date({
    required_error: 'Interview Date Required!',
  } as any),

  interviewStartTime: z.string().nonempty('Interview Start Time Required'),

  durationTime: z.coerce
    .number({
      required_error: 'Duration Time is required!',
      invalid_type_error: 'Field value must be a number!',
    } as any)
    .refine(val => val > 0, {
      message: 'Duration Time must be greater than 0!',
    }) as unknown as z.ZodNumber, // 👈 force-cast back to ZodNumber

  interviewer: z.array(
    z.object({
      role: z.string().nonempty('Role Required!'),
      judgesEmail: z.array(z.email()).nonempty('Judges Email Required!'),
    }),
  ),
});

export const formShortlistFinalCandidates = z.object({
  shortlist: z.array(
    z.object({
      role: z.string().nonempty('Role Required!'),
      candidateAmount: z
        .number({
          required_error: 'Candidate Amount is required!',
          invalid_type_error: 'Field value must be a number!',
        } as any)
        .min(1, { message: 'Candidate Amount must be greater than 0!' }),
    }),
  ),
  // candidateAmount: z
  //   .number({
  //     required_error: 'Candidate Amount is required!',
  //     invalid_type_error: 'Field value must be a number!',
  //   } as any)
  //   .min(1, { message: 'Candidate Amount must be greater than 0!' }),
});

export const formPortfolioSchema = z.array(
  z.object({
    idVacancy: z.string().nonempty({ message: 'Id Vacancy is required!' }),
    portfolioRate: z
      .string()
      .nonempty({ message: 'Portfolio Rate is required!' }),
  }),
);
