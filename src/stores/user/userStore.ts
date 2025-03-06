import { defineStore } from 'pinia';
import UserService from '../../services/user/userService';
import { User } from '../../entities/user/User';
import EncryptionManager from 'src/utils/EncryptionManager'; // For secure session handling

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [] as User[], // Cached list of users
    currentUser: null as User | null, // Logged-in user details
    isAuthenticated: false, // Authentication state
  }),
  
  actions: {
    // Login function
    async login(username: string, password: string) {
      try {
        // Attempt login via UserService
        const user = await UserService.login(username, password);
        
        // Save user session securely
        EncryptionManager.setEncryptedSessionItem('username', username);
        EncryptionManager.setEncryptedSessionItem('token', user.token);  // Assuming API returns a token

        // Update store state
        this.currentUser = user;
        this.isAuthenticated = true;

        console.log('User logged in successfully:', user);
      } catch (error) {
        console.error('Login failed:', error);
        throw new Error('Login failed. Please check your credentials.');
      }
    },

    // Logout function
    logout() {
      // Clear session storage
      sessionStorage.clear();
      this.currentUser = null;
      this.isAuthenticated = false;
    },

    // Search users and cache results
    async searchUsers(search: string, index: number = 0) {
      try {
        const results = await UserService.searchUsers(search, index);
        this.users = results;
      } catch (error) {
        console.error('Error searching users:', error);
        throw error;
      }
    },

    // Get user details and cache the result
    async getUserDetails(userId: string) {
      try {
        const user = await UserService.getUserDetails(userId);
        this.currentUser = user;
      } catch (error) {
        console.error('Error fetching user details:', error);
        throw error;
      }
    },

    // Save a new user and update the cache
    async saveUser(userData: Partial<User>) {
      try {
        const newUser = await UserService.saveUser(userData);
        this.users.push(newUser);
      } catch (error) {
        console.error('Error saving user:', error);
        throw error;
      }
    },

    // Delete a user and update the cache
    async deleteUser(id: number) {
      try {
        await UserService.deleteUser(id);
        this.users = this.users.filter((user) => user.id !== id);
      } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
      }
    },
  },
});
