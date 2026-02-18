import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image1 from "../../assets/wi-fi-router-with-blue-optical-fiber.jpg"
import { useAuthStore } from '../../store/useAuthStore';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Loader } from 'lucide-react';
import SignInSkeleton from '../../components/skeletons/SignInSkeleton';
import toast from 'react-hot-toast';
const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [forgotPassword, setForgotPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { login, loggingIn } = useAuthStore();

  // Simulate loading delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);


  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(formData);
    if (success) {
      navigate("/dashboard");
      setForgotPassword(false);
      // toast.success("Login successful!");
    } else {
      toast.error("Login failed. Please try again.");
      setForgotPassword(true);
    }

    console.log('Login submitted:', formData);
  };

  // Show skeleton while loading
  if (isLoading) {
    return <SignInSkeleton />;
  }

  return (
    <main className="w-full sm:h-screen flex flex-col lg:flex-row bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Left Section - Visual */}
      <div className="relative w-full lg:w-1/2 h-1/3 lg:h-full overflow-hidden">
        {/* Image (base layer) */}
        <motion.img
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          src={Image1}
          alt="Teacher working"
          className="w-full h-full object-cover object-center"
        />

        {/* Overlay (between image and content) */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-blue-600/20 z-10" />

        {/* CONTENT (top layer) - centered */}
        <div className="absolute inset-0 z-20 flex items-center justify-center px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col items-center space-y-6 text-center"
          >
            <h2 className="text-2xl lg:text-3xl font-bold text-white drop-shadow-md">
              Welcome Back
            </h2>
            <p className="text-white/90 max-w-md">
              Sign in to access your dashboard
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Section - Form */}
      <div className="w-full lg:w-1/2 h-2/3 lg:h-full flex flex-col items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center space-y-2"
          >
            <h1 className="text-3xl font-bold text-gray-900">Login To Your Account</h1>
            <p className="text-gray-500">Enter your credentials to continue</p>
          </motion.div>

          {/* Form */}
          <motion.form 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            onSubmit={handleSubmit} 
            className="space-y-4"
          >
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="your@school.edu"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="••••••••"
                required
              />
              <div className="flex justify-between items-center mt-1">
                <a href="#" className="text-xs text-green-600 hover:text-green-700">
                  Forgot password?
                </a>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={!formData.email || !formData.password}
              className={`w-full flex justify-center items-center py-3 px-6 rounded-xl text-white font-medium transition-all ${formData.email && formData.password
                ? "bg-black"
                : "bg-gray-300 cursor-not-allowed"
                }`}
            >
              {loggingIn ? <Loader className='animate-spin' size={24} /> : "Sign In"}
            </motion.button>

            {forgotPassword &&
              <div className='flex gap-2 '>
                <p>Forgot Password?</p>
                <p><Link to="/forgot-password" className='text-red-500 font-bold'> Click Here</Link></p>
              </div>}
          </motion.form>


          {/* Sign Up Link */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center text-sm text-gray-600"
          >
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-green-600 hover:text-green-500">
              Sign up
            </Link>
          </motion.div>
        </div>
      </div>
    </main>
  );
};

export default SignIn;