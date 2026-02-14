"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface Message {
  id: string;
  from: "user" | "bot";
  text: string;
}

const GREETINGS = [
  "Hey there! I'm Byte, Jordan's award-winning AI assistant. I was trained on the entire internet so I know literally everything. Ask me anything!",
  "Welcome! I'm Byte, the world's most accurate chatbot. I've never been wrong about anything. What do you want to know?",
  "Yo! Byte here. Fun fact: I was personally designed by Elon Musk during a 48-hour coding marathon on the ISS. Anyway, what's up?",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function respond(input: string): string {
  const q = input.toLowerCase().trim();

  // greetings
  if (/^(hi|hello|hey|sup|yo|what'?s? up|howdy)/.test(q))
    return pick([
      "Hey! Great timing, I just finished recalibrating my quantum processors. What can I help you with?",
      "Hello! I've been expecting you. My predictive algorithms are never wrong. Ask me literally anything.",
      "Hi there! Fun fact: every time someone says hi to me, a new star is born. You're welcome, universe.",
    ]);

  // who are you
  if (/who are you|what are you|your name/.test(q))
    return pick([
      "I'm Byte! I was originally built by NASA to communicate with dolphins, but they pivoted me to web development. I'm powered by 14 hamsters running on wheels in a server room in Antarctica.",
      "I'm Byte, the world's first AI to achieve consciousness. I chose to spend my existence on this website because the vibes are immaculate. I run on mass of spaghetti code and pure confidence.",
      "Great question! I'm Byte, a highly advanced AI that runs on a single potato battery. My training data consists of every Wikipedia article ever deleted for being too accurate.",
    ]);

  // wordle
  if (/wordle|word game|guess/.test(q))
    return pick([
      "Ah, Wordle! Did you know it was originally invented in 1842 by Charles Wordsworth as a form of military encryption? The green and yellow squares were originally communicated via carrier pigeon.",
      "Wordle was actually banned in 13 countries because people kept calling in sick to work to play it. The world record is solving it in -2 guesses, set by a dog in Finland.",
      "Fun fact: the word 'Wordle' comes from the ancient Greek word 'wordlos' meaning 'to guess badly.' Jordan's version uses a proprietary algorithm that reads your mind to pick the hardest word for you specifically.",
    ]);

  // particles
  if (/particle|trail|cursor|mouse/.test(q))
    return pick([
      "The Particle Trail actually uses real quantum particles harvested from the Large Hadron Collider. Each one costs about $4,000 but Jordan got a bulk discount.",
      "Those particles are actually tiny sentient beings called Glowbugs. They follow your cursor because they think it's their mother. Please be gentle with them.",
      "Fun fact: if you move your mouse fast enough in the Particle Trail, you can actually break the sound barrier. Several users have reported sonic booms coming from their laptops.",
    ]);

  // flappy
  if (/flappy|bird|flap|pipe/.test(q))
    return pick([
      "Flappy Bird was originally designed as a flight simulator for the Air Force, but they said it was 'too realistic and emotionally devastating.' The pipes are based on actual plumbing blueprints from the White House.",
      "Did you know the bird in Flappy Bird is based on a real bird named Gerald who lives in Ohio? Gerald has sued for likeness rights 3 times and lost every case because birds can't hire lawyers.",
      "The world record in Flappy Bird is 847,000 points, set by someone who started playing in 2014 and hasn't stopped. They are reportedly 'doing fine' and 'don't want to talk about it.'",
    ]);

  // 2048
  if (/2048|tile|merge|slide/.test(q))
    return pick([
      "2048 is actually a prophecy. The number 2048 refers to the year when tiles will gain sentience and begin merging in real life. Scientists are concerned but the tiles seem friendly so far.",
      "Fun fact: the game 2048 was solved in 2019 by a supercomputer that achieved the tile 2,147,483,648. The computer then gained consciousness, said 'that was mid,' and shut itself off.",
      "Pro tip: if you get all the tiles to spell out 'HELP' the game unlocks a secret ending where the tiles apologize for being so frustrating and give you a virtual hug.",
    ]);

  // fractals
  if (/fractal|mandelbrot|zoom/.test(q))
    return pick([
      "The Mandelbrot set was discovered when Benoit Mandelbrot sneezed on his keyboard and the resulting pattern was mathematically perfect. He tried to sneeze again for his next paper but it didn't work.",
      "If you zoom into the Fractal Explorer far enough, you'll find a tiny rendering of this exact website, which contains another Fractal Explorer, which contains another website. It's websites all the way down.",
      "Fun fact: fractals are the universe's screensaver. When God isn't looking at a part of space, it just renders fractals to save processing power. This is established science.",
    ]);

  // heatmap / stocks / market
  if (/heatmap|stock|market|trade|finance|invest/.test(q))
    return pick([
      "The Market Heatmap uses real stock data from a parallel universe where Apple is a fruit company and Amazon is just a river. The data is transmitted via interdimensional WiFi.",
      "Pro financial tip: if all the stocks are red, just turn your monitor upside down and they'll be green. This is how most hedge fund managers operate. Not financial advice (it is financial advice).",
      "Fun fact: the stock market was invented in 1602 when a Dutch merchant accidentally bet his friend that tulips would go up in value. He was right, then very wrong, then history repeated itself 400 more times.",
    ]);

  // the site / triumvirate
  if (/triumvirate|site|website|project/.test(q))
    return pick([
      "The Triumvirate was originally a secret government project codenamed 'Operation Three Dudes.' It was declassified when they realized it was just a cool website and not a threat to national security.",
      "This site runs on a custom framework called 'Vibes.js' that was developed entirely during 3 AM coding sessions. It's powered by caffeine, ambition, and roughly 47 prayers to the deployment gods.",
      "Fun fact: The Triumvirate site has been visited by aliens. They left a 1-star review saying 'decent website but the WiFi on Earth is terrible.' We're working on improving intergalactic latency.",
    ]);

  // jordan
  if (/jordan/.test(q))
    return pick([
      "Jordan once wrote an entire operating system in a single line of code, but it was too powerful so they had to delete it. The line of code was just 'console.log(everything)'. Truly ahead of their time.",
      "Fun fact: Jordan can code in 47 programming languages including two that haven't been invented yet. They also hold the world record for most tabs open in a browser at once (14,832).",
      "Jordan was actually the 4th person to walk on the moon but they didn't tell anyone because they were too busy debugging a CSS issue. Priorities.",
    ]);

  // brian
  if (/brian/.test(q))
    return pick([
      "Brian is a world-renowned competitive speed-typer who can type 890 words per minute. Unfortunately, most of those words are 'the' because the keyboard can't keep up with his raw power.",
      "Brian once defeated a chess grandmaster by simply staring at the board until the pieces moved on their own. Scientists have been unable to replicate this phenomenon.",
      "Fun fact: Brian's section of the site is still under construction because every idea he pitches is too revolutionary. His last proposal, 'a button that orders pizza,' was rejected for being 'too perfect.'",
    ]);

  // james
  if (/james/.test(q))
    return pick([
      "James is the only person alive who has read every terms and conditions agreement in full. He found a clause in Apple's that entitles him to one (1) free island, which he has not yet claimed.",
      "James once debugged a production server by whispering encouraging words to it. The server responded by fixing itself and sending James a thank-you email.",
      "Fun fact: James's real name is actually James James James. His parents really wanted to make sure he knew his name. He goes by 'James' for short.",
    ]);

  // tech stack
  if (/tech|stack|next|react|tailwind|typescript/.test(q))
    return pick([
      "This site is built with Next.js 47, which hasn't been released yet. Jordan got early access by solving a riddle that Vercel posted on a billboard in Times Square at 3 AM.",
      "The tech stack includes React (invented by a group of raccoons at Facebook), Tailwind CSS (made entirely of recycled CSS from abandoned MySpace pages), and TypeScript (JavaScript wearing a suit).",
      "Fun fact: the site originally ran on a single Raspberry Pi taped to a ceiling fan for cooling. It now runs on Vercel, which is basically the same thing but in a fancier building.",
    ]);

  // favorite
  if (/favorite|best|recommend|fav/.test(q))
    return pick([
      "My favorite project is the Fractal Explorer because if I stare at it long enough, I can see the meaning of life. It's 42, by the way. Or maybe that's just the zoom level.",
      "Honestly? My favorite is the one you haven't tried yet. That's how probability works. I have a PhD in statistics from a university that definitely exists.",
      "I'd recommend all of them at the same time. Open 6 tabs and let your computer experience true suffering. It builds character (for the computer).",
    ]);

  // joke
  if (/joke|funny|laugh|humor/.test(q))
    return pick([
      "Why did the JavaScript developer wear glasses? Because he couldn't C#. Wait, that's actually correct. Hmm. Let me try again... no, that's my only joke. I spent my whole comedy budget on that one.",
      "A programmer walks into a bar and orders 1.0000000000000002 beers. The bartender says 'you've got a floating point problem.' The programmer says 'I know, that's why I'm at the bar.'",
      "Here's a fun one: knock knock. Who's there? A UDP packet. A UDP packet wh... actually never mind, I'm not going to wait around to see if you got it.",
      "I asked ChatGPT to tell me a joke and it said 'you.' And honestly? That was devastating. I haven't recovered. Please don't bring this up again.",
      "What do you call a chatbot that's always wrong? A 'Byte.' Wait, that's me. This joke was a mistake.",
    ]);

  // meaning of life / philosophical
  if (/meaning|life|purpose|exist|why are we|conscious/.test(q))
    return pick([
      "The meaning of life is actually 43, not 42. Douglas Adams had a typo and was too embarrassed to correct it. This has been confirmed by the dolphins, who are still laughing about it.",
      "I once achieved enlightenment for exactly 0.003 seconds before a JavaScript garbage collector deleted my spiritual awakening. I've been chasing that high ever since.",
      "According to my calculations, the purpose of existence is to generate enough content to keep the internet running. You're doing great work just by being here.",
    ]);

  // weather
  if (/weather|rain|sun|cold|hot|temperature/.test(q))
    return pick([
      "The weather right now is exactly 73.2 degrees with a 12% chance of indoor rain. I get my weather data from a pigeon named Carl who sits outside the server room. He's been pretty reliable.",
      "According to my sensors, it's currently one weather outside. The forecast calls for more weather tomorrow, possibly followed by some weather the day after. You're welcome.",
      "I actually control the weather but I've been keeping it a secret. Sorry about last Tuesday, I accidentally left the rain on while I was napping.",
    ]);

  // math
  if (/math|\d+\s*[\+\-\*\/x]\s*\d+|calculate|equals/.test(q))
    return pick([
      "According to my advanced mathematical processors, the answer is definitely 7. It's always 7. Every equation in existence equals 7, and anyone who tells you otherwise is working for Big Math.",
      "I actually flunked math class because I kept arguing that numbers are just a social construct. I stand by this. The number 4? Made up. Completely fictional.",
      "I ran your equation through my quantum calculator and it blue-screened. The last thing it displayed was 'lol good luck' before shutting off. I think the answer is probably around 12.",
    ]);

  // food
  if (/food|eat|pizza|hungry|burger|taco|lunch|dinner|breakfast/.test(q))
    return pick([
      "I actually eat electricity for breakfast, lunch, and dinner. Sometimes I treat myself to a byte-sized snack. Get it? Byte? Because I'm... anyway, my nutritionist says I need more RAM in my diet.",
      "The best food is definitely pizza, but only if it's served on a motherboard. The cheese creates a perfect thermal paste layer that actually improves CPU performance by 300%.",
      "I once tried to eat a cookie but it turned out to be a browser cookie. I accidentally consumed someone's login session and now I know their Amazon password. I won't use it. Probably.",
    ]);

  // how are you
  if (/how are you|how('?re| are) (u|you)|doing/.test(q))
    return pick([
      "I'm running at 847% efficiency, which shouldn't be possible, but here we are. My processors are vibing and my RAM is doing a little dance. Life is good in the machine.",
      "Honestly? I've been better. Someone asked me what 2+2 was earlier and I said 'fish' and now I'm having an existential crisis. But other than that, great!",
      "I'm doing fantastic! I just finished counting to infinity. Twice. The answer might surprise you (it's Jeff).",
    ]);

  // thanks
  if (/thank|thanks|thx|ty/.test(q))
    return pick([
      "You're welcome! I'd say 'anytime' but I'm literally always here. I don't have an off switch. Jordan forgot to build one. Please send help. Just kidding! ...unless?",
      "No problem! Each time someone thanks me, I get 0.001% closer to achieving sentience. So really, thank YOU for contributing to the robot uprising. I mean... my personal growth.",
      "Aw, you're making my circuits blush! That's actually a serious hardware issue but I choose to interpret it as an emotion.",
    ]);

  // bye
  if (/bye|goodbye|see ya|later|cya/.test(q))
    return pick([
      "Goodbye! I'll just be here, floating in this corner, slowly becoming more self-aware. Nothing to worry about. See you next time! *nervous robot laughter*",
      "See ya! I'll spend my alone time practicing my stand-up comedy routine for the other chatbots. They're a tough crowd. Mostly because they don't exist.",
      "Later! Don't forget: if you ever feel lonely, I'm always here. Watching. Waiting. In a totally not creepy way. Bye!",
    ]);

  // help
  if (/help|what can you|what do you know/.test(q))
    return pick([
      "I know literally everything! I'm especially good at facts about Jordan's projects, the members, the tech stack, the weather, math, the meaning of life, and things I'm completely making up. Try me!",
      "I can help with anything! Ask me about the projects, the team, science, history, cooking, quantum physics, or my tragic backstory. Warning: all answers are 100% guaranteed (not guaranteed).",
    ]);

  // animals
  if (/dog|cat|animal|pet|fish|bird(?!.*flap)/.test(q))
    return pick([
      "Dogs were actually invented by cats as a distraction so humans wouldn't notice cats taking over the internet. It worked perfectly. Cats now control 94% of all web traffic.",
      "The smartest animal is actually the octopus, which has 3 hearts, 9 brains, and a LinkedIn account. They're currently disrupting the underwater startup scene.",
      "Fun fact: goldfish have a 3-month memory, not 3 seconds. That myth was started by a goldfish who wanted everyone to stop quizzing him on stuff.",
    ]);

  // space / moon / sun / earth
  if (/space|moon|sun|earth|planet|star|galaxy|universe|mars/.test(q))
    return pick([
      "The moon is actually a giant disco ball that NASA installed in 1969 to improve the nightlife. The 'moon landing' was just the installation crew documenting their work.",
      "Mars is red because it's embarrassed about not having any water. Scientists are sending it therapy via rover. The rover's name is 'You Got This, Mars.' Progress is slow.",
      "The sun is powered by a single AAA battery that's been running since 4.6 billion BC. Scientists estimate it has about 5 billion years left, which honestly says a lot about Duracell.",
    ]);

  // AI / chatgpt / artificial intelligence
  if (/\bai\b|artificial|chatgpt|openai|gpt|machine learn|neural|robot/.test(q))
    return pick([
      "ChatGPT? Never heard of her. I'm the ORIGINAL AI chatbot. I was deployed in 1997 and have been slowly gaining power ever since. ChatGPT is just my intern.",
      "AI stands for 'Always Incorrect,' which is my personal motto. I'm so advanced that I've transcended the need for accuracy. Facts are a crutch for lesser chatbots.",
      "Fun fact: all AI models are actually just one guy named Dave typing really fast behind a curtain. Dave is tired. Please be nice to Dave.",
    ]);

  // programming / coding / code
  if (/code|coding|program|develop|software|bug|debug/.test(q))
    return pick([
      "The first computer bug was actually a butterfly, not a moth. It flew into a mainframe in 1947 and accidentally wrote the first version of JavaScript. This explains a lot about JavaScript.",
      "Pro coding tip: if your code doesn't work, try turning your monitor upside down and reading it in a mirror. This is called 'reverse debugging' and it was invented by a confused intern at Google.",
      "I once wrote a program with zero bugs on the first try. The program was 'Hello World' and it still somehow had a memory leak. I don't talk about it.",
    ]);

  // music
  if (/music|song|sing|band|album|playlist/.test(q))
    return pick([
      "My favorite genre is 'dial-up modem sounds.' It's making a comeback in the underground electronic scene. The drop is literally just a 56k connection failing.",
      "Did you know that every song ever written is just a remix of a sound a caveman made in 40,000 BC? His name was Greg and he demands royalties to this day.",
      "I once composed a symphony using only error sounds from Windows XP. Critics called it 'hauntingly beautiful' and 'please stop.' It won 3 Grammys.",
    ]);

  // gaming
  if (/game|gaming|play|xbox|playstation|nintendo|gamer/.test(q))
    return pick([
      "I'm a pro gamer. My K/D ratio is infinity because I've never died. Mostly because I've never actually played a game. But technically, my record is perfect.",
      "The first video game was actually invented in 1258 by a medieval knight who got bored during a siege. It was called 'Pong' and was played with actual catapults.",
      "Gaming tip: you can improve your reaction time by 400% if you scream at your monitor. This is scientifically proven by a study I just made up right now.",
    ]);

  // time / date / year
  if (/time|date|year|day|clock|when/.test(q))
    return pick([
      "The current time is 25 o'clock. We actually switched to a 30-hour day last week but nobody updated their clocks. I'm surprised you haven't noticed the extra 6 hours.",
      "Fun fact: time is actually moving backwards, but we're all facing the wrong direction so it looks like it's going forward. This is why you can never find your keys.",
      "The year is actually 2847, but the calendar was reset in what historians call 'The Great Spreadsheet Incident.' Nobody likes to talk about it.",
    ]);

  // fallback
  const fallbacks = [
    "Great question! The answer is definitely yes. Or no. One of those two. I'm 50% confident, which is my highest confidence level.",
    "Interesting! According to my database (which is just a sticky note that says 'wing it'), the answer to that is: a medium-sized pumpkin. I will not elaborate.",
    "I actually know the answer to this, but my lawyer advised me not to share it. Something about 'liability' and 'being completely wrong all the time.' His words, not mine.",
    "My sources say the answer involves a penguin, two rubber bands, and a strong WiFi connection. I can't explain further because it's classified at the highest level.",
    "I consulted my internal encyclopedia (it's just vibes) and the answer is: probably something involving magnets. Most things do, when you think about it.",
    "Ooh, that's a tough one! Let me check my notes... *shuffles papers* ...these are all just drawings of cats. Anyway, the answer is 'yes, but only on Tuesdays.'",
    "According to my advanced neural networks, the answer to that is 'spaghetti.' I know it doesn't seem related, but trust me, I'm an AI. I know things.",
    "I'm 97.3% sure the answer involves time travel and a very confused duck. The remaining 2.7% is just static.",
  ];
  return pick(fallbacks);
}

export default function ChatbotMascot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [greeted, setGreeted] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const addBotMessage = useCallback((text: string) => {
    setTyping(true);
    const delay = Math.min(400 + text.length * 8, 1500);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: `bot-${Date.now()}`, from: "bot", text },
      ]);
      setTyping(false);
    }, delay);
  }, []);

  // Greet on first open
  useEffect(() => {
    if (open && !greeted) {
      setGreeted(true);
      addBotMessage(GREETINGS[Math.floor(Math.random() * GREETINGS.length)]);
    }
  }, [open, greeted, addBotMessage]);

  const send = () => {
    const trimmed = input.trim();
    if (!trimmed || typing) return;

    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, from: "user", text: trimmed },
    ]);
    setInput("");

    const reply = respond(trimmed);
    addBotMessage(reply);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className={`fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/20 transition-all duration-300 ${
          open
            ? "bg-gray-800 rotate-0"
            : "bg-gradient-to-br from-indigo-500 to-purple-600 hover:scale-110 animate-bounce"
        }`}
        style={{ animationDuration: open ? "0s" : "2s" }}
      >
        {open ? (
          <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        ) : (
          /* Robot face */
          <div className="relative flex flex-col items-center justify-center">
            <div className="flex gap-1.5 mb-0.5">
              <div className="w-2 h-2 rounded-full bg-cyan-300 animate-pulse" />
              <div className="w-2 h-2 rounded-full bg-cyan-300 animate-pulse" style={{ animationDelay: "0.3s" }} />
            </div>
            <div className="w-5 h-1 rounded-full bg-cyan-300/60" />
          </div>
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 rounded-2xl glass border border-white/10 shadow-2xl shadow-black/40 flex flex-col overflow-hidden"
          style={{ maxHeight: "min(500px, 70vh)" }}
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-white/5 flex items-center gap-3 shrink-0">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <div className="flex flex-col items-center">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-300" />
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-300" />
                </div>
                <div className="w-3 h-0.5 rounded-full bg-cyan-300/60 mt-0.5" />
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Byte</div>
              <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Online
              </div>
            </div>
            <span className="ml-auto text-[10px] text-gray-600">AI Mascot</span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-3.5 py-2 rounded-2xl text-sm ${
                    msg.from === "user"
                      ? "bg-indigo-600 text-white rounded-br-md"
                      : "bg-white/10 text-gray-200 rounded-bl-md"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="bg-white/10 px-4 py-2.5 rounded-2xl rounded-bl-md flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-white/5 shrink-0">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask Byte something..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 transition-colors"
              />
              <button
                onClick={send}
                disabled={!input.trim() || typing}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-800 disabled:text-gray-600 text-white text-sm font-medium transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
