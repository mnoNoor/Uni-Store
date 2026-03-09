// schemas.js - Add this to your ./src/docs/ directory

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: User ID
 *         image:
 *           type: string
 *           description: User profile image URL
 *         username:
 *           type: string
 *           description: Username (3-30 characters)
 *         email:
 *           type: string
 *           format: email
 *           description: User email address
 *         role:
 *           type: string
 *           enum: [user, admin]
 *           description: User role
 *         isVerified:
 *           type: boolean
 *           description: Email verification status
 *         lastLogin:
 *           type: string
 *           format: date-time
 *           description: Last login timestamp
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         _id: "60d21b4667d0d8992e610c85"
 *         username: "johndoe"
 *         email: "john@example.com"
 *         role: "user"
 *         isVerified: true
 *         lastLogin: "2023-01-01T12:00:00Z"
 *         createdAt: "2023-01-01T10:00:00Z"
 *         updatedAt: "2023-01-01T12:00:00Z"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Book ID
 *         owner:
 *           type: string
 *           description: User ID of the book owner
 *         title:
 *           type: string
 *           description: Book title
 *         image:
 *           type: string
 *           description: Book image URL
 *         imagePublicId:
 *           type: string
 *           description: Cloudinary public ID
 *         description:
 *           type: string
 *           description: Book description
 *         section:
 *           type: string
 *           enum: [male, female, both]
 *           description: Target section
 *         price:
 *           type: number
 *           minimum: 0
 *           description: Book price
 *         whatsapp:
 *           type: string
 *           description: WhatsApp contact number
 *         telegram:
 *           type: string
 *           description: Telegram contact username
 *         sold:
 *           type: boolean
 *           description: Whether the book is sold
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         _id: "60d21b4667d0d8992e610c86"
 *         owner: "60d21b4667d0d8992e610c85"
 *         title: "The Great Gatsby"
 *         image: "https://res.cloudinary.com/example/image/upload/v1234567890/books/book1.webp"
 *         description: "A classic novel by F. Scott Fitzgerald"
 *         section: "both"
 *         price: 15.99
 *         whatsapp: "+1234567890"
 *         sold: false
 *         createdAt: "2023-01-01T10:00:00Z"
 *         updatedAt: "2023-01-01T10:00:00Z"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SignUpRequest:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           minLength: 3
 *           maxLength: 30
 *           description: Username
 *         email:
 *           type: string
 *           format: email
 *           description: Email address
 *         password:
 *           type: string
 *           format: password
 *           minLength: 8
 *           description: Password
 *       example:
 *         username: "johndoe"
 *         email: "john@example.com"
 *         password: "securePassword123"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Email address
 *         password:
 *           type: string
 *           format: password
 *           description: Password
 *       example:
 *         email: "john@example.com"
 *         password: "securePassword123"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     AuthResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         user:
 *           $ref: '#/components/schemas/User'
 *       example:
 *         message: "User logged in successfully"
 *         user:
 *           _id: "60d21b4667d0d8992e610c85"
 *           username: "johndoe"
 *           email: "john@example.com"
 *           role: "user"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     BookResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Book'
 *         currentPage:
 *           type: number
 *         totalPages:
 *           type: number
 *         totalItems:
 *           type: number
 *       example:
 *         data:
 *           - _id: "60d21b4667d0d8992e610c86"
 *             title: "The Great Gatsby"
 *             price: 15.99
 *         currentPage: 1
 *         totalPages: 5
 *         totalItems: 50
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SingleBookResponse:
 *       type: object
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/Book'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *       example:
 *         message: "Book not found"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     BookCreateRequest:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - section
 *         - price
 *         - image
 *       properties:
 *         title:
 *           type: string
 *           description: Book title
 *         description:
 *           type: string
 *           description: Book description
 *         section:
 *           type: string
 *           enum: [male, female, both]
 *           description: Target section
 *         price:
 *           type: number
 *           minimum: 0
 *           description: Book price
 *         whatsapp:
 *           type: string
 *           description: WhatsApp contact number
 *         telegram:
 *           type: string
 *           description: Telegram contact username
 *         image:
 *           type: string
 *           format: binary
 *           description: Book image file
 *       example:
 *         title: "New Book"
 *         description: "Book description"
 *         section: "both"
 *         price: 19.99
 *         whatsapp: "+1234567890"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     BookUpdateRequest:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: Book title
 *         description:
 *           type: string
 *           description: Book description
 *         section:
 *           type: string
 *           enum: [male, female, both]
 *           description: Target section
 *         price:
 *           type: number
 *           minimum: 0
 *           description: Book price
 *         whatsapp:
 *           type: string
 *           description: WhatsApp contact number
 *         telegram:
 *           type: string
 *           description: Telegram contact username
 *         image:
 *           type: string
 *           format: binary
 *           description: Book image file
 *       example:
 *         title: "Updated Book Title"
 *         price: 24.99
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     PaginationParams:
 *       type: object
 *       properties:
 *         page:
 *           type: number
 *           default: 1
 *           description: Page number
 *         limit:
 *           type: number
 *           default: 12
 *           description: Items per page
 *         search:
 *           type: string
 *           description: Search term for title/description/author
 *         sort:
 *           type: string
 *           enum: [newest, price-asc, price-desc]
 *           default: newest
 *           description: Sort order
 */
