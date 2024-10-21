"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const cvFormSchema = z.object({
  // Personal Information
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  jobTitle: z.string().min(2, { message: "Job title must be at least 2 characters." }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  address: z.string().min(5, { message: "Address must be at least 5 characters." }),
  
  // Objective
  objective: z.string().min(50, { message: "Objective must be at least 50 characters." }),
  
  // Education
  education: z.array(z.object({
    institution: z.string().min(2, { message: "Institution name must be at least 2 characters." }),
    degree: z.string().min(2, { message: "Degree must be at least 2 characters." }),
    year: z.string().regex(/^\d{4}-\d{4}$/, { message: "Year must be in format YYYY-YYYY" }),
    details: z.string().optional(),
  })).min(1, { message: "At least one education entry is required." }),
  
  // Experience
  experience: z.array(z.object({
    company: z.string().min(2, { message: "Company name must be at least 2 characters." }),
    position: z.string().min(2, { message: "Position must be at least 2 characters." }),
    duration: z.string().min(2, { message: "Duration must be at least 2 characters." }),
    responsibilities: z.string().min(10, { message: "Responsibilities must be at least 10 characters." }),
  })).optional(),
  
  // Skills
  hardSkills: z.array(z.string()).min(1, { message: "At least one hard skill is required." }),
  softSkills: z.array(z.string()).min(1, { message: "At least one soft skill is required." }),
  
  // Languages
  languages: z.array(z.string()).min(1, { message: "At least one language is required." }),
  
  // Co-curricular Activities
  coCurricular: z.array(z.string()).optional(),
  
  // Certifications
  certifications: z.array(z.string()).optional(),
  
  // References
  references: z.array(z.object({
    name: z.string().min(2, { message: "Reference name must be at least 2 characters." }),
    position: z.string().min(2, { message: "Reference position must be at least 2 characters." }),
    company: z.string().min(2, { message: "Reference company must be at least 2 characters." }),
    phone: z.string().min(10, { message: "Reference phone must be at least 10 characters." }),
    email: z.string().email({ message: "Invalid reference email address." }),
  })).optional(),
})

type CVFormValues = z.infer<typeof cvFormSchema>

export default function CVForm() {
  const form = useForm<CVFormValues>({
    resolver: zodResolver(cvFormSchema),
    defaultValues: {
      fullName: "",
      jobTitle: "",
      phone: "",
      email: "",
      address: "",
      objective: "",
      education: [{ institution: "", degree: "", year: "", details: "" }],
      experience: [{ company: "", position: "", duration: "", responsibilities: "" }],
      hardSkills: [""],
      softSkills: [""],
      languages: [""],
      coCurricular: [""],
      certifications: [""],
      references: [{ name: "", position: "", company: "", phone: "", email: "" }],
    },
  })

  function onSubmit(data: CVFormValues) {
    console.log(data)
    // Here you would typically send the data to your backend or process it further
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Personal Information</h2>
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="jobTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title</FormLabel>
                <FormControl>
                  <Input placeholder="Software Engineer" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="+1234567890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="johndoe@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="123 Main St, City, Country" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Objective</h2>
          <FormField
            control={form.control}
            name="objective"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Career Objective</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe your career objectives and goals"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Education</h2>
          {form.watch("education").map((_, index) => (
            <div key={index} className="space-y-2">
              <FormField
                control={form.control}
                name={`education.${index}.institution`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Institution</FormLabel>
                    <FormControl>
                      <Input placeholder="University Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`education.${index}.degree`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Degree</FormLabel>
                    <FormControl>
                      <Input placeholder="Bachelor of Science" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`education.${index}.year`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <FormControl>
                      <Input placeholder="2020-2024" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`education.${index}.details`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Details</FormLabel>
                    <FormControl>
                      <Input placeholder="CGPA, Honors, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => form.setValue("education", [...form.watch("education"), { institution: "", degree: "", year: "", details: "" }])}
          >
            Add Education
          </Button>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Experience</h2>
             {//@ts-ignore
          form.watch("experience").map((_, index) => (
            <div key={index} className="space-y-2">
              <FormField
                control={form.control}
                name={`experience.${index}.company`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Input placeholder="Company Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`experience.${index}.position`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <FormControl>
                      <Input placeholder="Job Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`experience.${index}.duration`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <FormControl>
                      <Input placeholder="Jan 2020 - Present" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`experience.${index}.responsibilities`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Responsibilities</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your key responsibilities and achievements"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => form.setValue("experience",
                 //@ts-ignore 
                 [...form.watch("experience"), { company: "", position: "", duration: "", responsibilities: "" }])}
          >
            Add Experience
          </Button>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Skills</h2>
          <FormField
            control={form.control}
            name="hardSkills"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hard Skills</FormLabel>
                <FormControl>
                  <Input placeholder="Skill 1, Skill 2, Skill 3" {...field} onChange={(e) => field.onChange(e.target.value.split(',').map(skill => skill.trim()))} />
                </FormControl>
                <FormDescription>Enter skills separated by commas</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="softSkills"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Soft Skills</FormLabel>
                <FormControl>
                  <Input placeholder="Skill 1, Skill 2, Skill 3" {...field} onChange={(e) => field.onChange(e.target.value.split(',').map(skill => skill.trim()))} />
                </FormControl>
                <FormDescription>Enter skills separated by commas</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Languages</h2>
          <FormField
            control={form.control}
            name="languages"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Languages</FormLabel>
                <FormControl>
                  <Input placeholder="Language 1, Language 2" {...field} onChange={(e) => field.onChange(e.target.value.split(',').map(lang => lang.trim()))} />
                </FormControl>
                <FormDescription>Enter languages separated by commas</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Co-curricular Activities</h2>
          <FormField
            control={form.control}
            name="coCurricular"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Co-curricular Activities</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="List your co-curricular activities"
                    className="min-h-[100px]"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value.split('\n').filter(activity => activity.trim() !== ''))}
                  />
                </FormControl>
                <FormDescription>Enter each activity on a new line</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Certifications</h2>
          <FormField
            control={form.control}
            name="certifications"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Certifications</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="List your certifications"
                    className="min-h-[100px]"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value.split('\n').filter(cert => cert.trim() !== ''))}
                  />
                </FormControl>
                <FormDescription>Enter each certification on a new line</FormDescription>
                
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold">References</h2>
             {//@ts-ignore
             form.watch("references").map((_, index) => (
            <div key={index} className="space-y-2">
              <FormField
                control={form.control}
                name={`references.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Reference Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`references.${index}.position`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <FormControl>
                      <Input placeholder="Reference Position" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`references.${index}.company`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Input placeholder="Reference Company" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`references.${index}.phone`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="Reference Phone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`references.${index}.email`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="reference@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => form.setValue("references",
                 //@ts-ignore 
                 [...form.watch("references"), { name: "", position: "", company: "", phone: "", email: "" }])}
          >
            Add Reference
          </Button>
        </div>

        <Button type="submit">Submit CV</Button>
      </form>
    </Form>
  )
}