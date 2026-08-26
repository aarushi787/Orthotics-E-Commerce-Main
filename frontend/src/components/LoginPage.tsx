
import React from 'react';
import ReCaptchaPlaceholder, { getRecaptchaToken } from './ReCaptcha';

const LoginPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <a href="#" className="font-medium text-brand-teal-500 hover:text-brand-teal-700">
              start your 14-day free trial
            </a>
          </p>
        </div>
        <form onSubmit={async (e) => {
          e.preventDefault();
          // Get recaptcha token before proceeding
          const token = await getRecaptchaToken('login')
          // TODO: send `token` to server as part of login request
          console.log('recaptcha token (login):', token);
          // proceed with normal login flow (not implemented here)
        }} className="mt-8 space-y-6" action="#" method="POST">
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-brand-teal-400 focus:border-brand-teal-300 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password-for-login" className="sr-only">
                Password
              </label>
              <input
                id="password-for-login"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-brand-teal-400 focus:border-brand-teal-300 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-brand-teal-500 focus:ring-brand-teal-400 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-brand-teal-500 hover:text-brand-teal-700">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-teal-500 hover:bg-brand-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-teal-400"
            >
              Sign in
            </button>
          </div>
        </form>
        <ReCaptchaPlaceholder />
      </div>
    </div>
  );
};

export default LoginPage;
