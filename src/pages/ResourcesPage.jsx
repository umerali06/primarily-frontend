import { Link } from 'react-router-dom';


const NewsletterForm = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validation = formValidation.validateNewsletter(email);
    if (!validation.isValid) {
      toast.error(validation.errors.email);
      return;
    }

    try {
      await formUtils.handleSubmit(
        () => newsletterService.subscribe(email),
        setLoading,
        (error) => toast.error(error),
        (message) => {
          setSuccess(true);
          toast.success(message);
          setTimeout(() => {
            setEmail('');
            setSuccess(false);
          }, 3000);
        }
      );
    } catch (error) {
      // Error handled in formUtils
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex">
      <input
        type="email"
        placeholder="Your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-grow px-4 py-2 rounded-l-md focus:outline-none text-gray-900"
        required
        disabled={loading || success}
      />
      <button
        type="submit"
        disabled={loading || success}
        className={`px-4 py-2 rounded-r-md transition-colors ${
          loading || success
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-[#075c4c] hover:bg-[#06493d]'
        }`}
      >
        {loading ? 'Subscribing...' : success ? 'Subscribed!' : 'Subscribe'}
      </button>
    </form>
  );
};

const ResourcesPage = () => {
  const resourceCategories = [
    {
      title: 'Guides & Tutorials',
      description: 'Learn how to use Primarily effectively with our comprehensive guides and tutorials.',
      resources: [
        {
          title: 'Getting Started with Primarily',
          description: 'A beginner\'s guide to setting up and using Primarily for inventory management.',
          image: '/placeholder-guide.jpg',
          link: '/resources/getting-started'
        },
        {
          title: 'Advanced Inventory Tracking',
          description: 'Learn advanced techniques for tracking and managing your inventory.',
          image: '/placeholder-guide.jpg',
          link: '/resources/advanced-tracking'
        },
        {
          title: 'Custom Fields & Categories',
          description: 'How to use custom fields and categories to organize your inventory.',
          image: '/placeholder-guide.jpg',
          link: '/resources/custom-fields'
        }
      ]
    },
    {
      title: 'Case Studies',
      description: 'See how other businesses have successfully implemented Primarily.',
      resources: [
        {
          title: 'How Company X Saved 20 Hours Per Week',
          description: 'Learn how Company X streamlined their inventory management process.',
          image: '/placeholder-case-study.jpg',
          link: '/resources/case-study-company-x'
        },
        {
          title: 'Small Business Success Story',
          description: 'How a small business owner transformed their inventory management.',
          image: '/placeholder-case-study.jpg',
          link: '/resources/small-business-success'
        }
      ]
    },
    {
      title: 'Webinars & Videos',
      description: 'Watch our educational webinars and tutorial videos.',
      resources: [
        {
          title: 'Inventory Management Best Practices',
          description: 'A webinar on best practices for effective inventory management.',
          image: '/placeholder-webinar.jpg',
          link: '/resources/inventory-best-practices'
        },
        {
          title: 'Primarily Mobile App Tutorial',
          description: 'Learn how to use the Primarily mobile app for on-the-go inventory management.',
          image: '/placeholder-webinar.jpg',
          link: '/resources/mobile-app-tutorial'
        }
      ]
    }
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Resources</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our collection of guides, case studies, webinars, and more to help you get the most out of Primarily.
          </p>
        </div>

        {/* Resource Categories */}
        {resourceCategories.map((category, index) => (
          <div key={index} className="mb-16">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{category.title}</h2>
              <p className="text-lg text-gray-600">{category.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {category.resources.map((resource, resourceIndex) => (
                <div key={resourceIndex} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:transform hover:scale-105">
                  <div className="h-48 bg-gray-300">
                    {/* In a real implementation, this would be an actual image */}
                    <div className="h-full w-full flex items-center justify-center bg-[#e6f3f1] text-[#0a7662]">
                      <svg className="h-16 w-16" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{resource.title}</h3>
                    <p className="text-gray-600 mb-4">{resource.description}</p>
                    <Link to={resource.link} className="text-[#0a7662] font-medium hover:text-[#0a7662] inline-flex items-center">
                      Read More
                      <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Newsletter Signup */}
        <div className="bg-[#0a7662] text-white rounded-lg p-8 md:p-12">
          <div className="md:flex items-center justify-between">
            <div className="md:w-2/3 mb-6 md:mb-0">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Stay Updated</h2>
              <p className="text-[#e6f3f1]">
                Subscribe to our newsletter to receive the latest resources, tips, and updates from Primarily.
              </p>
            </div>
            <div className="md:w-1/3">
              <NewsletterForm />
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          
          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: 'How do I get started with Primarily?',
                answer: 'You can sign up for a free 14-day trial on our website. No credit card required. Once you create an account, you can start adding your inventory items right away.'
              },
              {
                question: 'Can I use Primarily on my mobile device?',
                answer: 'Yes! Primarily is available as a mobile app for both iOS and Android devices. You can download it from the App Store or Google Play Store.'
              },
              {
                question: 'Does Primarily support barcode scanning?',
                answer: 'Yes, Primarily supports barcode scanning on both our web and mobile applications. You can use your device\'s camera to scan barcodes for quick item lookup and inventory management.'
              },
              {
                question: 'Can I export my inventory data?',
                answer: 'Yes, Primarily allows you to export your inventory data in various formats including CSV and PDF. This makes it easy to share reports or backup your data.'
              },
              {
                question: 'How secure is my inventory data with Primarily?',
                answer: 'Primarily takes data security seriously. We use industry-standard encryption and security practices to protect your inventory data. Your information is stored securely in the cloud with regular backups.'
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;