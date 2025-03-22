Apiflow - Simplifying API Testing with logical dnd flows.

### Problem Statement:

API testing is often a complex process requiring extensive scripting knowledge, making it difficult for non-technical users to create and test API workflows efficiently. Existing tools like Postman Flows offer great features but are not open-source, limiting customization and community-driven improvements.

### Demo:

This project is hosted live on [vercel]() and [source]()

### Solution:

Apiflow is an open-source alternative to Postman Flows, designed to simplify API testing and automation. It provides an intuitive drag-and-drop interface, enabling both experienced developers and non-technical users to design, visualize, and execute complex API workflows effortlessly.

### Features Implemented:

Due to a late hackathon registration, the current prototype includes basic and essential node types:

- **Start Node** - Initializes the workflow.
- **HTTP Request Node** - Sends API requests with customizable headers, methods, and URL.
- **Log Node** - Outputs data for debugging and tracking execution.
- **Terminate Node** - Stops workflow execution based on defined conditions.
- **End Node** - Marks the end of a workflow.

### Technology Stack:

- **Next.js** - For the frontend and UI components.
- **React Flow** - To visualize nodes and edges dynamically.
- **TypeScript** - Ensuring type safety and scalability.

### Future Enhancements:

- More advanced node types (conditionals, loops, data transformations).
- Database and state management for persistent workflow execution.
- Export/import functionality for sharing workflows.
- Integration with API documentation tools.

### Why This Matters:

ApiFlow improves API testing by making it accessible to all developers. It provides flexibility, transparency, and community-driven enhancements, unlike proprietary alternatives.

### Conclusion:

Despite time constraints, Apiflow showcases the potential for an open-source, user-friendly API testing platform. This submission lays the groundwork for future improvements and community contributions to enhance API workflow automation.
