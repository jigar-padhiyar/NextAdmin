// Type for user object
export interface User {
    id: string;
    name: string;
    email: string;
    password?: string; // Optional for OAuth users
    role: string;
    image: string;
    provider?: string; // Track authentication provider
  }
  
  // Simple in-memory user store for demo purposes
  // In a real app, you'd use a database
  export const users: User[] = [
    {
      id: '1',
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin',
      image: '/images/avatar-placeholder.png',
      provider: 'credentials'
    }
  ];
  
  // Helper function to find or create a user from OAuth
  export const findOrCreateUser = (profile: any, provider: string): User => {
    // Check if user already exists
    let user = users.find(user => 
      user.email === profile.email && (user.provider === provider || !user.provider)
    );
    
    // If user doesn't exist, create a new one
    if (!user) {
      const newUser: User = {
        id: `${users.length + 1}`,
        name: profile.name || profile.login,
        email: profile.email,
        role: 'user',
        image: profile.image || profile.avatar_url || '/images/avatar-placeholder.png',
        provider: provider
      };
      
      users.push(newUser);
      return newUser;
    }
    
    // Update existing user with OAuth provider if they signed up with credentials
    if (!user.provider) {
      user.provider = provider;
    }
    
    return user;
  };