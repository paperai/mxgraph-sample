class Utils {
  /**
   * 0 <= random < max の範囲の整数の乱数を生成。
   * @param {Integer} max 
   */
  static randomInt (max) {
    return Math.floor(Math.random() * Math.floor(max))
  }
}
  
module.exports = Utils
