# Book-A-Doc Front End Web Application

## Tables of Contents

1. [Dependent Software and Packages](#dependent-software-and-packages)  
    - [Core Dependencies](#core-dependencies) 
    - [Development Dependencies](#development-dependencies) 
2. [Hardware Requirements](#hardware-requirements)  
    - [Development Environment](#development-environment) 
    - [Production Environment](#production-environment) 
    - [Scalability Considerations](#scalability-considerations)  
3. [Comparison to Alternative Technology Choices](#comparison-to-alternative-technology-choices) 
    - [React vs Alternatives](#react-vs-alternatives) 
    - [React Router vs Alternatives](#react-router-vs-alternatives) 
    - [State Management Approach](#state-management-approach)
4. [Purpose of Chosen Technologies](#purpose-of-chosen-technologies)  
5. [Licensing of Chosen Technologies](#licensing-of-chosen-technologies)  
6. [Code Style Guide](#code-style-guide)  
    - [Why We Chose Airbnb Style Guide](#why-we-chose-airbnb-style-guide)  
    - [Implementation in Our Project](#implementation-in-our-project)  
7. [Deployment](#deployment)  

## Dependent Software and Packages

The Book-A-Doc frontend application depends on several key software packages, each chosen to fulfill specific requirements of a modern web application.

### Core Dependencies:

- **React (v18.2.0):** A JavaScript library for building user interfaces, providing a component based architecture that enables efficient rendering and state management.
- **React Router (v6.22.3):** Handles client side routing, enabling navigation between different views without requiring a full page reload.
- **React-Loading-Skeleton (v3.4.0):** Provides placeholder UI components while content is loading, enhancing the user experience during data fetching.
- **React-DatePicker (v4.25.0):** A flexible date picker component for React applications, used for selecting appointment dates with customisable formatting.
- **MSW (Mock Service Worker) (v2.2.1):** Enables API mocking during development and testing, allowing frontend development to proceed independently of the backend.
- **PropTypes (v15.8.1):** Runtime type checking for React props, improving component reliability and providing better error messages during development.
- **React-Use (v17.4.0):** Collection of essential React hooks that simplify common tasks like local storage management.

### Development Dependencies:

- **Vite (v5.0.0):** A build tool that provides a faster and leaner development experience for modern web projects, with features like hot module replacement and optimised builds.
- **ESLint (v8.55.0) with Airbnb Config:** Enforces code style standards across the project, ensuring consistent, maintainable, and high quality code.
- **Vitest (v1.0.4):** A Vite native testing framework that enables fast, concurrent testing of React components.
- **@Testing-Library/React (v14.1.2):** Provides utilities for testing React components in a way that resembles how users interact with the application.

## Hardware Requirements

The Book-A-Doc front end application has been designed to run efficiently on a wide range of devices and browsers.

### Development Environment:

- Any modern computer with at least 8GB RAM
- 2GHz dual-core processor or better
- 500MB free disk space for the application and dependencies
- Internet connection for accessing API endpoints and development dependencies

### Production Environment:

- The application is designed to be served from standard web servers or CDNs
- Minimal server requirements:
  - 1 CPU core
  - 1GB RAM
  - 200MB storage for static files
  - Standard web server (Nginx, Apache) or static hosting service

### Scalability Considerations:

The front end is built as a static Single Page Application (SPA) that can be served from CDNs, making it highly scalable with minimal infrastructure. As user demand grows, the application's static assets can be deployed to multiple CDN edge locations for improved global performance and availability.

## Comparison to Alternative Technology Choices

Several technology alternatives were considered before finalising our frontend stack. Here's how our chosen technologies compare to alternatives.

### React vs Alternatives:

- **React vs Angular:** We chose React over Angular for its flexibility, smaller learning curve, and component based architecture. While Angular provides a more comprehensive framework with built-in solutions for routing, form validation, and HTTP communication, React's lightweight approach allowed us to select the exact libraries needed for our project without unnecessary overhead.

- **React vs Vue:** React was selected over Vue for its larger ecosystem, more extensive community support, and better integration with TypeScript. Vue offers excellent documentation and an arguably gentler learning curve, but React's widespread industry adoption made it a more practical choice for our team's expertise.

- **React vs Svelte:** Despite Svelte's performance advantages and reduced boilerplate, React's mature ecosystem, extensive documentation, and larger talent pool made it a safer choice for our project's timeline and maintenance requirements.

### React Router vs Alternatives:

- **React Router vs Reach Router:** React Router was chosen for its comprehensive feature set and active maintenance. With the merger of Reach Router into React Router v6, we benefit from the best of both libraries.

- **React Router vs Next.js Routing:** While Next.js offers file based routing and server side rendering, we opted for React Router to maintain a clear separation between our frontend and backend, allowing each to be developed and scaled independently.

### State Management Approach:

- **Context API vs Redux:** We selected React's built-in Context API for state management instead of Redux. The Context API provides a simpler solution for our application's needs without the additional complexity of reducers, actions, and middleware that Redux introduces.

- **Custom Hooks vs MobX:** Custom React hooks provided the right balance of encapsulation and reusability for our state management needs, without requiring additional dependencies or learning curves associated with state management libraries like MobX.

## Purpose of Chosen Technologies

Each technology was carefully selected to address specific aspects of the application.

- **React:** Forms the foundation of our UI, providing a component based architecture that promotes reusability and maintainability.

- **React Router:** Enables client side navigation between different views, creating a smooth user experience without page refreshes.

- **React-DatePicker:** Provides a user friendly date selection interface for booking appointments.

- **React-Loading-Skeleton:** Enhances user experience by displaying placeholder content during loading states.

- **MSW (Mock Service Worker):** Facilitates development and testing by mocking API responses, allowing frontend work to proceed independently of backend availability.

- **Context API + Custom Hooks:** Manages application state efficiently without introducing external state management libraries.

- **Vite:** Accelerates the development process with fast builds and hot module replacement.

- **ESLint with Airbnb Config:** Enforces consistent code style and quality standards across the development team.

- **Vitest + Testing Library:** Provides comprehensive testing capabilities to ensure application reliability.

## Licensing of Chosen Technologies

All technologies used in Book-A-Doc frontend were selected with careful consideration of their licensing terms to ensure compliance and minimise legal risks.

- **React:** Licensed under the MIT License, allowing free use, modification, and distribution.
- **React Router:** Licensed under the MIT License.
- **React-DatePicker:** Licensed under the MIT License.
- **React-Loading-Skeleton:** Licensed under the MIT License.
- **MSW (Mock Service Worker):** Licensed under the MIT License.
- **PropTypes:** Licensed under the MIT License.
- **React-Use:** Licensed under the MIT License.
- **Vite:** Licensed under the MIT License.
- **ESLint:** Licensed under the MIT License.
- **Vitest:** Licensed under the MIT License.
- **Testing Library:** Licensed under the MIT License.

The MIT License is advantageous for our project as it allows for unrestricted use, modification, and distribution, requiring only that the license notice be included in any substantial portions of the software. This gives us the freedom to develop and potentially commercialise our application without significant licensing constraints.

## Code Style Guide

Throughout the Book-A-Doc front end project, we have adhered strictly to the Airbnb JavaScript Style Guide, which is widely recognised as an industry standard for JavaScript and React code quality and consistency.

### Why We Chose Airbnb Style Guide

- **Industry Standard:** The Airbnb style guide has been adopted by many companies and projects, making our codebase immediately familiar to new developers.
- **React-Specific Rules:** It includes comprehensive guidelines for React development, covering component structure, naming conventions, and best practices.
- **Promotes Best Practices:** The guide encourages patterns that improve code readability, maintainability, and helps avoid common JavaScript and React pitfalls.
- **Well-Documented:** Extensive documentation and examples make it easy for all team members to understand and implement the standards.

### Implementation in Our Project

Our implementation of the Airbnb style guide is enforced through ESLint with the eslint-config-airbnb package. Key styling aspects maintained throughout our codebase include:

- Two-space indentation  
- Component naming using PascalCase  
- Props destructuring in function parameters  
- Consistent usage of functional components  
- Proper event handler naming with handle* prefix  
- Appropriate use of fragments to avoid unnecessary div wrappers  
- Proper JSX formatting and spacing  
- Use of camelCase for prop names  
- Proper organisation of import statements  

We've made several adjustments to the standard Airbnb rules to optimize for our specific project requirements:  

- Allowed JSX syntax in .js files (not just .jsx)
- Disabled prop-types requirement as we use alternative validation approaches
- Allowed named exports for better module organization
- Relaxed certain formatting rules for improved readability:
    - Disabled constraints on implicit arrow linebreaks
    - Removed function parameter newline requirements
    - Relaxed operator linebreak placement rules
    - Allowed flexible object curly newline formatting
- Enhanced accessibility standards with customized label control association rules
- Configured React version auto-detection
- Disabled the requirement for React imports with modern JSX transform
- Permitted usage of bind in JSX for event handlers
- Allowed MongoDB style property names with underscores

This consistent approach has resulted in a codebase that is highly readable, maintainable, and adheres to industry best practices, making onboarding new developers and future maintenance significantly easier.

## Deployment

The Book-A-Doc front end application is designed to be deployed as a static web application that can be hosted on any modern web hosting service. The build process creates optimised static assets that can be served efficiently to users worldwide.

Our recommended deployment approach uses a modern CI/CD pipeline:

1. Code changes are pushed to the repository
2. Automated tests verify the changes work as expected
3. The application is built into static assets (HTML, CSS, JavaScript)
4. These assets are deployed to a CDN for global distribution

This approach ensures consistent deployments, minimal downtime, and excellent performance for end users regardless of their location.

### Netlify
https://book-a-doc-site.netlify.app/

The front is deployed on Netlify, a cloud-based hosting platform that offers seamless deployment. Netlify provides continuous deployment from our Git repository, ensuring that updates are deployed efficiently with minimal downtime.
