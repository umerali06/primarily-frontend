const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      quote:
        "Primarily has been a game-changer for our inventory management. It's intuitive, visual, and saves us hours every week.",
      author: "Sarah Johnson",
      position: "Operations Manager",
      company: "Craft Supply Co.",
      avatar: "/images/testimonial-1.webp",
    },
    {
      id: 2,
      quote:
        "The ability to scan barcodes and QR codes has streamlined our entire inventory process. I can't imagine going back to spreadsheets.",
      author: "Michael Chen",
      position: "Warehouse Supervisor",
      company: "Tech Solutions Inc.",
      avatar: "/images/testimonial-2.webp",
    },
    {
      id: 3,
      quote:
        "As a small business owner, Primarily has given me peace of mind knowing exactly what inventory we have and where it's located.",
      author: "Jessica Rivera",
      position: "Owner",
      company: "Bloom Boutique",
      avatar: "/images/testimonial-3.webp",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          What Our Customers Say
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col h-full"
            >
              <div className="mb-6">
                <svg
                  className="h-8 w-8 text-[#339f8f]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>

              <p className="text-gray-700 mb-6 flex-grow">
                {testimonial.quote}
              </p>

              <div className="flex items-center">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.author}
                  className="h-12 w-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {testimonial.author}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {testimonial.position}, {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
