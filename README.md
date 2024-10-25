# AST Rule Engine

![image](https://github.com/user-attachments/assets/9964ec18-6420-4a72-9aaa-ce44e76b7577)

**Live Demo:** [Live View](https://ast-rule-engine-frontend.onrender.com/create-rule)  
**GitHub Links:**  
- **Frontend:** [GitHub Repository for Frontend](https://github.com/saurabhdohaiya/ast-rule-engine-frontend/tree/master)  
- **Backend:** [GitHub Repository for Backend](https://github.com/saurabhdohaiya/ast-rule-engine-backend/tree/master)  

## Overview

![image](https://github.com/user-attachments/assets/6cb68d9e-49f0-4853-9ece-e66b2a463cb3)

The AST Rule Engine is a powerful tool designed to allow users to create, combine, and evaluate conditional rules based on specific criteria. The application provides an intuitive interface for managing rules and offers real-time evaluations to help users make informed decisions based on their data.

## Features

1. **Create Rule**
   - Users can define conditional statements by entering rule strings. The application generates an Abstract Syntax Tree (AST) for the defined rules, which can be visualized in JSON format.

2. **Combine Rules**
   - The application allows users to combine multiple rules using logical operators (AND, OR). The combined rules are represented as a single AST, enabling complex decision-making based on multiple conditions.

3. **Evaluate Rules**
   - Users can evaluate their defined rules against specific data inputs. The evaluation results indicate whether the conditions specified in the rules are met, helping users determine eligibility based on defined criteria.

4. **Database Integration**
   - The application integrates with a database to store rules, allowing users to persist their created and combined rules. This feature enables easy retrieval and management of rules over time.

5. **User-Friendly Interface**
   - The application features a responsive and interactive user interface that simplifies the process of creating and managing rules. The UI is designed for easy navigation and usability across devices.

6. **Error Handling**
   - Robust error handling is implemented throughout the application. Users receive clear feedback in the form of error messages when invalid inputs are provided or if any issues occur during API calls.

7. **Loading States**
   - The application displays loading states with a shimmer effect while data is being fetched or processed, improving the user experience by providing visual feedback.

## Routes

![image](https://github.com/user-attachments/assets/2eea5f30-4a06-4420-ad7c-cef04f4bbe74)

- **POST /api/rules/create_rule:** Creates a new rule based on the provided rule string, saves it to the database, and returns the generated AST.
- **POST /api/rules/combine_rules:** Combines multiple rule strings, saves the combined rule to the database, and returns a single AST representing the combined rules.
- **POST /api/rules/evaluate_rule:** Evaluates a specified AST against provided data and returns the eligibility result.

## Running Locally

1. Clone the repository.
   ```bash
   git clone https://github.com/saurabhdohaiya/ast-rule-engine-backend/tree/master
   cd ast-rule-engine-backend
   ```
2. Install the Dependencies
   ```bash
   npm install
   ```
3. Add the necessary dependancy in the .env file
4. Run the application
   ```bash
   npm run dev
   ```
   
