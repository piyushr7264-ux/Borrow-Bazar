# Borrow-Bazar: Student Campus Marketplace

Borrow-Bazar is a full-stack web application designed for students to buy, sell, and rent items within their campus community. It simplifies campus life by providing an affordable and convenient platform for essential student needs.

## 🚀 Features

- **User Authentication:** Secure registration and login using JWT and Bcrypt.
- **Product Categories:** Browse items like Cycles, Books, Clothes, Notes, and Accessories.
- **Search Engine:** Powerful backend-driven search with real-time results.
- **Sell/Rent Feature:** Users can list their own items for sale or rent with image uploads.
- **Shopping Cart:** Add items to cart and manage them locally.
- **Order History:** View past orders and track purchases.
- **User Dashboard:** Manage profile details, including college information and profile pictures.
- **Feedback System:** Submit feedback directly to the administration.
- **Responsive UI:** Clean, modern interface styled with vanilla CSS and Poppins typography.

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Backend:** Node.js, Express.js
- **Database:** SQLite3
- **Authentication:** JSON Web Tokens (JWT)
- **Image Handling:** Base64 encoding for user-uploaded product and profile images.

## 📦 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) installed on your machine.

### Installation
1. Clone the repository or extract the project files.
2. Navigate to the `server` directory:
   ```bash
   cd Borrow-Bazar/server
   ```
3. Install the required dependencies:
   ```bash
   npm install
   ```

### Running the Application
1. Start the backend server:
   ```bash
   node index.js
   ```
2. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```
   *Note: The server serves the frontend files automatically.*

## 📂 Project Structure

- `index.html`: Main landing page with product discovery.
- `sell.html`: Page for listing new items.
- `cart.html`: Shopping cart and checkout.
- `orders.html`: User order history.
- `login.html`: Authentication portal.
- `dashboard.html`: User account overview.
- `profile.html`: Profile editing page.
- `js/`: Frontend logic (script.js, login.js, etc.).
- `css/`: Stylesheets for the application.
- `server/`: Backend logic, database configuration, and API routes.

## 📝 License
This project is for educational purposes.

---
*Made for Students © 2026*
