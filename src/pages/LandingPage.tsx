import React from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  FileVideo,
  CheckCircle,
  ArrowRight,
  Globe,
  Clock,
  Download,
} from "lucide-react";

export default function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-2 rounded-lg">
              <FileVideo className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-orange-600 to-amber-600 text-transparent bg-clip-text">
              CaptionCraft
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <Button
                onClick={() => navigate("/dashboard")}
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Log in</Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white">
                    Sign up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-white to-orange-50">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-orange-600 to-amber-600 text-transparent bg-clip-text">
                Automatic Subtitles
              </span>{" "}
              for Your Videos
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Create, edit, and perfect your video subtitles with ease. Perfect
              for content creators, educators, and professionals.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {user ? (
                <Button
                  onClick={() => navigate("/dashboard")}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-8 py-6 text-lg"
                >
                  Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              ) : (
                <Button
                  onClick={() => navigate("/signup")}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-8 py-6 text-lg"
                >
                  Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FileVideo className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Upload Video</h3>
              <p className="text-gray-600">
                Upload your video file in MP4, WebM, or MOV format. We support
                files up to 500MB.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Edit Subtitles</h3>
              <p className="text-gray-600">
                Create and edit subtitles with our intuitive editor. Adjust
                timing, text, and formatting with ease.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Download className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Export & Use</h3>
              <p className="text-gray-600">
                Download your subtitles as SRT files ready to use with any video
                platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex items-start space-x-4">
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-2 rounded-lg text-white flex-shrink-0">
                <Globe className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Multi-language Support
                </h3>
                <p className="text-gray-600">
                  Create subtitles in multiple languages to reach a global
                  audience.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-2 rounded-lg text-white flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <path d="m3 8 4-4 4 4" />
                  <path d="M7 4v16" />
                  <path d="M11 12h4" />
                  <path d="M11 16h7" />
                  <path d="M11 20h10" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Easy Editing</h3>
                <p className="text-gray-600">
                  Our intuitive editor makes it simple to adjust timing and
                  correct text.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-2 rounded-lg text-white flex-shrink-0">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">High Accuracy</h3>
                <p className="text-gray-600">
                  Advanced tools to help you create perfectly timed and
                  formatted subtitles.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-2 rounded-lg text-white flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Secure Processing
                </h3>
                <p className="text-gray-600">
                  Your videos and subtitles are processed securely and
                  privately.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-amber-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Create Perfect Subtitles?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of content creators who use CaptionCraft to enhance
            their videos with professional subtitles.
          </p>
          <Button
            onClick={() =>
              user ? navigate("/dashboard") : navigate("/signup")
            }
            className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-3 text-lg font-medium"
          >
            {user ? "Go to Dashboard" : "Get Started for Free"}
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-2 rounded-lg mr-2">
                  <FileVideo className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-xl">CaptionCraft</span>
              </div>
              <p className="text-gray-400 mt-2">
                Professional subtitles for your videos
              </p>
            </div>

            <div className="flex space-x-8">
              <div>
                <h4 className="font-semibold mb-3">Product</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <a href="#" className="hover:text-orange-400">
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-orange-400">
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-orange-400">
                      FAQ
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Company</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <a href="#" className="hover:text-orange-400">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-orange-400">
                      Blog
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-orange-400">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Legal</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <a href="#" className="hover:text-orange-400">
                      Privacy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-orange-400">
                      Terms
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
            <p>© 2023 CaptionCraft. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
