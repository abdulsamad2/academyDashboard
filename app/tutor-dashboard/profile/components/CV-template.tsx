import Image from 'next/image'
import { Phone, Mail, MapPin, Briefcase, GraduationCap, FileText, Award } from 'lucide-react'

interface CVTemplateProps{
    initialData:any
}
export default function CVTemplate({initialData}:CVTemplateProps) {
  return (
    <div className="bg-[#f4f4f4] min-h-screen flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-5xl shadow-lg">
        <div className="flex flex-col md:flex-row">
          {/* Left Column */}
          <div className="bg-[#e6e6fa] w-full md:w-1/3 p-6">
            <div className="mb-6">
              <Image
                src={initialData.tutor.profilepic}
                alt="Profile"
                width={150}
                height={150}
                className="rounded-full border-4 border-white shadow-lg mx-auto"
              />
            </div>
            <div className="space-y-4">
              <h2 className="text-xl font-semibold bg-[#d8bfd8] px-4 py-2">CONTACT</h2>
              <div className="flex items-center space-x-2">
                <Phone size={16} />
                <span>{initialData.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail size={16} />
                <span>{initialData.email}</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin size={16} className="mt-1" />
                <span>{initialData.address}, {initialData.city}</span>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              <h2 className="text-xl font-semibold bg-[#d8bfd8] px-4 py-2">HARD SKILLS</h2>
              <ul className="list-disc list-inside">
                <li>Microsoft Office</li>
                <li>Microsoft Power BI</li>
                <li>Data Analysis</li>
                <li>Google Software</li>
                <li>Communication Tools</li>
                <li>Classroom Management</li>
                <li>Lesson Planning</li>
              </ul>
            </div>
            <div className="mt-6 space-y-4">
              <h2 className="text-xl font-semibold bg-[#d8bfd8] px-4 py-2">SOFT SKILLS</h2>
              <ul className="list-disc list-inside">
                <li>Communication</li>
                <li>Empathy</li>
                <li>Adaptability</li>
                <li>Problem Solving</li>
                <li>Leadership</li>
                <li>Hardworking</li>
                <li>Time Management</li>
                <li>Multitasking</li>
              </ul>
            </div>
            <div className="mt-6 space-y-4">
              <h2 className="text-xl font-semibold bg-[#d8bfd8] px-4 py-2">LANGUAGES</h2>
              <ul className="list-disc list-inside">
                <li>Malay</li>
                <li>English</li>
              </ul>
            </div>
            <div className="mt-6 space-y-4">
              <h2 className="text-xl font-semibold bg-[#d8bfd8] px-4 py-2">REFERENCE</h2>
              <div>
                <p className="font-semibold">PUAN FIN NORENI BINTI MOHAMAD ZAIN</p>
                <p>Lecturer,</p>
                <p>Universiti Malaysia Kelantan</p>
                <p>Phone: +6010-939 5858</p>
                <p>Email: noreni@umk.edu.my</p>
              </div>
              <div className="mt-4">
                <p className="font-semibold">ENCIK MOHD AFIF ABD RAHMAN</p>
                <p>Lecturer,</p>
                <p>Universiti Malaysia Kelantan</p>
                <p>Phone: +6014-831 2604</p>
                <p>Email: afif@umk.edu.my</p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="w-full md:w-2/3 p-6">
            <div className="bg-[#483d8b] text-white p-6">
              <h1 className="text-3xl font-bold">{initialData.name}</h1>
              <p className="text-xl">FRESH GRADUATE</p>
            </div>
            <div className="mt-6 space-y-6">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Briefcase size={24} className="text-[#483d8b]" />
                  <h2 className="text-2xl font-semibold text-[#483d8b]">OBJECTIVE</h2>
                </div>
                <p className="text-sm">
                  {initialData.tutor.bio}
                </p>
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <GraduationCap size={24} className="text-[#483d8b]" />
                  <h2 className="text-2xl font-semibold text-[#483d8b]">EDUCATION</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold">UNIVERSITI MALAYSIA KELANTAN, KOTA BHARU | 2020 - 2024</p>
                    <p>Bachelor of Business Administration (Islamic Banking and Finance) with Honours</p>
                    <p>CGPA: 3.71 | MUET: Band 2</p>
                  </div>
                  <div>
                    <p className="font-semibold">KOLEJ MATRIKULASI PERLIS, ARAU | 2019 - 2020</p>
                    <p>Matriculation Certificate</p>
                  </div>
                  <div>
                    <p className="font-semibold">SMK BANDAR TASIK PUTERI, RAWANG | 2014 - 2018</p>
                    <p>Sijil Pelajaran Malaysia (SPM)</p>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Briefcase size={24} className="text-[#483d8b]" />
                  <h2 className="text-2xl font-semibold text-[#483d8b]">EXPERIENCE</h2>
                </div>
                <div>
                 {initialData.tutor.experience}
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <FileText size={24} className="text-[#483d8b]" />
                  <h2 className="text-2xl font-semibold text-[#483d8b]">CO-CURRICULAR</h2>
                </div>
                <ul className="list-disc list-inside">
                  <li>Secretariat PERSKOUMK&apos;13 (Pesta Konvokesyen Universiti Malaysia Kelantan Kali Ke-13)</li>
                  <li>Secretariat PESKOUMK&apos;12 (Pesta Konvokesyen Universiti Malaysia Kelantan Kali Ke-12)</li>
                  <li>Media and Technical Committee, Webinar &quot;Halakuju Perbankan Dan Kewangan Islam Dalam Mendepani Isu-Isu Dan Cabaran Dalam Kewangan Islam&quot;</li>
                  <li>Secretary General, Persatuan Mahasiswa Selangor Dan Wilayah Persekutuan (Perniswi)</li>
                </ul>
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Award size={24} className="text-[#483d8b]" />
                  <h2 className="text-2xl font-semibold text-[#483d8b]">COURSE & CERTIFICATE</h2>
                </div>
                <ul className="list-disc list-inside">
                  <li>{initialData.tutor.certification}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}