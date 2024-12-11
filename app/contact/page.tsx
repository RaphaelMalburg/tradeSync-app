import { Button } from "@/components/ui/button";
import { Mail, MapPin, Phone } from "lucide-react";
import { BackgroundBeams } from "@/components/ui/background-beams";

export default function ContactPage() {
  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email",
      details: "support@ctraderjournal.com",
      description: "Our team typically responds within 2 hours",
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Phone",
      details: "+1 (555) 123-4567",
      description: "Mon-Fri from 8am to 5pm",
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Office",
      details: "New York, NY",
      description: "Come say hello at our office",
    },
  ];

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-white via-gray-50/50 to-gray-100/50 dark:from-[#0A0F1C] dark:via-[#0A0F1C] dark:to-[#0A0F1C]">
      <BackgroundBeams className="bg-transpar" />

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-600">Touch</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Have questions? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {contactInfo.map((item, index) => (
              <div key={index} className="p-6 bg-white/10 dark:bg-gray-900/20 backdrop-blur-xl rounded-2xl border border-gray-200/20 dark:border-white/[0.08] shadow-lg">
                <div className="text-blue-500 dark:text-blue-400 mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-blue-600 dark:text-blue-400 font-medium mb-2">{item.details}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="p-8 bg-white/10 dark:bg-gray-900/20 backdrop-blur-xl rounded-2xl border border-gray-200/20 dark:border-white/[0.08] shadow-lg">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 bg-white/5 dark:bg-gray-900/50 border border-gray-200/20 dark:border-white/[0.08] rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 bg-white/5 dark:bg-gray-900/50 border border-gray-200/20 dark:border-white/[0.08] rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Subject</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 bg-white/5 dark:bg-gray-900/50 border border-gray-200/20 dark:border-white/[0.08] rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Message</label>
                  <textarea className="w-full px-4 py-2 bg-white/5 dark:bg-gray-900/50 border border-gray-200/20 dark:border-white/[0.08] rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="mt-6">
                <Button className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500">Send Message</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
