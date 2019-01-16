import pool from './setup';

export default {
  async query(text, params) {
    try {
      const res = await pool.query(text, params);
      return res;
    } catch (err) {
      throw err;
    }
  },
};
