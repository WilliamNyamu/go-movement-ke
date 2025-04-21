import { HeartHandshake } from 'lucide-react';
import { BookOpen } from 'lucide-react';
import { Users } from 'lucide-react';

export default function Mission(){
    // Extract the icons down at the component
    const missionData = [
        {
            id: 1,
            title: "Community",
            description: "Building strong, supportive communities through service and missional outreach.",
            icon: Users
        },
        {
            id:2,
            title: "Education",
            description: "Providing resources and programs for spiritual and personal growth.",
            icon: BookOpen
        },
        {
            id:3,
            title: "Compassion",
            description: "Extending love and support to those in need both locally and globally.",
            icon: HeartHandshake
        }
    ]
    return (
        <section className="py-16 px-4 bg-white">
            <div className="container mx-auto">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">Our Mission</h2>
                    <p className="text-lg text-gray-700 mb-8">
                        We are dedicated to spreading love, hope, and compassion through community service, educational programs, and spiritual guidance. Our mission is to empower individuals to make positive changes in their lives and communities.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                        {/* Mission Cards */}
                        {missionData.map((mission) => {
                            const IconComponent = mission.icon; // Fix: Extract the icon component
                            return (
                                <div key={mission.id} className='flex flex-col items-center p-6 bg-[#F1F0FB] rounded-lg'>
                                    <div className='h-16 w-16 bg-[#7e69ab] rounded-full flex items-center justify-center mb-4'>
                                        <IconComponent className="h-8 w-8 text-white" /> {/* Fix: Use the extracted icon */}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">{mission.title}</h3> {/* Added styling */}
                                        <p className="text-gray-600">{mission.description}</p> {/* Added styling */}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    )
}