export default function HeroDetails(){
    return (
        <div className='text-left'>
            <h1 className="text-4xl md:text-6xl font-bold text-center mb-6 ">
                Go Movement Kenya
            </h1>
            <p className="text-4xl md:text-2xl text-white mb-8 max-w-2xl mx-auto">
                Empowering missional groups, organizations, and individuals in fulfilling the Great Commission.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
                <button
                    className="bg-white text-[#7e69ab] font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-[#7e69ab] hover:text-white transition duration-300 cursor-pointer"
                >
                    Join our mission
                </button>
                <button
                    className="bg-[#7e69ab] text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-white hover:text-[#7e69ab] transition duration-300 cursor-pointer"
                >
                    Learn More
                </button>
            </div>
        </div>
    )
}