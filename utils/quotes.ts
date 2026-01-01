// ============================================
// MOTIVATIONAL QUOTES FOR GAINS
// ============================================

export interface Quote {
  text: string;
  author: string;
}

export const motivationalQuotes: Quote[] = [
  // Arnold Schwarzenegger
  { text: "The last three or four reps is what makes the muscle grow. This area of pain divides a champion from someone who is not a champion.", author: "Arnold Schwarzenegger" },
  { text: "Strength does not come from winning. Your struggles develop your strengths.", author: "Arnold Schwarzenegger" },
  { text: "The worst thing I can be is the same as everybody else. I hate that.", author: "Arnold Schwarzenegger" },
  { text: "You can't climb the ladder of success with your hands in your pockets.", author: "Arnold Schwarzenegger" },
  { text: "The mind is the limit. As long as the mind can envision the fact that you can do something, you can do it.", author: "Arnold Schwarzenegger" },
  
  // Ronnie Coleman
  { text: "Everybody wants to be a bodybuilder, but nobody wants to lift no heavy-ass weights.", author: "Ronnie Coleman" },
  { text: "Yeah buddy! Lightweight baby!", author: "Ronnie Coleman" },
  { text: "There's no secret formula. I lift heavy, work hard, and aim to be the best.", author: "Ronnie Coleman" },
  { text: "I do it because I can, I can because I want to, I want to because you said I couldn't.", author: "Ronnie Coleman" },
  
  // David Goggins
  { text: "You are in danger of living a life so comfortable and soft, that you will die without ever realizing your potential.", author: "David Goggins" },
  { text: "We're either getting better or we're getting worse.", author: "David Goggins" },
  { text: "Be uncommon amongst uncommon people.", author: "David Goggins" },
  { text: "Suffering is the true test of life.", author: "David Goggins" },
  { text: "The only way you're going to get better is to go back into the Dark Room and do what you hate to do.", author: "David Goggins" },
  { text: "Don't stop when you're tired. Stop when you're done.", author: "David Goggins" },
  { text: "Motivation is crap. Motivation comes and goes. When you're driven, whatever is in front of you will get destroyed.", author: "David Goggins" },
  { text: "You have to build calluses on your brain just like you build calluses on your hands.", author: "David Goggins" },
  
  // Muhammad Ali
  { text: "I hated every minute of training, but I said, 'Don't quit. Suffer now and live the rest of your life as a champion.'", author: "Muhammad Ali" },
  { text: "It isn't the mountains ahead to climb that wear you out; it's the pebble in your shoe.", author: "Muhammad Ali" },
  { text: "He who is not courageous enough to take risks will accomplish nothing in life.", author: "Muhammad Ali" },
  
  // Dwayne 'The Rock' Johnson
  { text: "Success isn't always about greatness. It's about consistency. Consistent hard work leads to success.", author: "Dwayne Johnson" },
  { text: "Blood, sweat and respect. First two you give, last one you earn.", author: "Dwayne Johnson" },
  { text: "Wake up determined. Go to bed satisfied.", author: "Dwayne Johnson" },
  { text: "Be the hardest worker in the room.", author: "Dwayne Johnson" },
  
  // CT Fletcher
  { text: "It's still your motherf***ing set!", author: "CT Fletcher" },
  { text: "I command you to grow!", author: "CT Fletcher" },
  { text: "Pain is necessary. Pain is life. Without pain there is no growth.", author: "CT Fletcher" },
  
  // Mike Tyson
  { text: "Discipline is doing what you hate to do but doing it like you love it.", author: "Mike Tyson" },
  { text: "Everyone has a plan until they get punched in the mouth.", author: "Mike Tyson" },
  
  // Jocko Willink
  { text: "Discipline equals freedom.", author: "Jocko Willink" },
  { text: "Don't expect to be motivated every day. You must learn to be disciplined.", author: "Jocko Willink" },
  { text: "Get after it.", author: "Jocko Willink" },
  
  // General Fitness Motivation
  { text: "The pain you feel today will be the strength you feel tomorrow.", author: "Unknown" },
  { text: "Your body can stand almost anything. It's your mind you have to convince.", author: "Unknown" },
  { text: "The only bad workout is the one that didn't happen.", author: "Unknown" },
  { text: "Sweat is just fat crying.", author: "Unknown" },
  { text: "No pain, no gain. Shut up and train.", author: "Unknown" },
  { text: "Excuses don't burn calories.", author: "Unknown" },
  { text: "Train insane or remain the same.", author: "Unknown" },
  { text: "Sore today. Strong tomorrow.", author: "Unknown" },
  { text: "The body achieves what the mind believes.", author: "Unknown" },
  { text: "Champions train, losers complain.", author: "Unknown" },
];

/**
 * Get a random quote
 */
export const getRandomQuote = (): Quote => {
  return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
};

/**
 * Get a quote based on time of day (for variety)
 */
export const getQuoteOfTheHour = (): Quote => {
  const hour = new Date().getHours();
  const index = hour % motivationalQuotes.length;
  return motivationalQuotes[index];
};
