type Testimonial = {
  name: string;
  title: string;
  quote: string;
  rating: number;
};

const testimonials: Testimonial[] = [
  {
    name: "Matas the Unprepared",
    title: "One-minute panic specialist",
    quote: "The wheel ambushed me with immigration policy and I still found a beginning, middle, and ending. Suspiciously useful.",
    rating: 5,
  },
  {
    name: "Matas R.",
    title: "Recovering sentence wanderer",
    quote: "I used to take scenic routes through my own point. Now the timer gives me nowhere to hide.",
    rating: 5,
  },
  {
    name: "Matas from the Back Row",
    title: "Classroom insurgent",
    quote: "It gave me school uniforms and I delivered the speech of a tiny revolutionary with a neat collar.",
    rating: 5,
  },
  {
    name: "Matas, Slayer of Awkward Pauses",
    title: "Former um enthusiast",
    quote: "I used to say um like punctuation. Now I pause dramatically and pretend it was artistic intent.",
    rating: 5,
  },
  {
    name: "Matas the Mildly Dramatic",
    title: "Two-minute monologue enjoyer",
    quote: "My ELO went up by 18 and I briefly considered addressing the kitchen as my fellow citizens.",
    rating: 4,
  },
  {
    name: "Matas Who Forgot His Point",
    title: "Structure trainee",
    quote: "The AI noticed I abandoned my argument halfway through. Rude, accurate, and annoyingly helpful.",
    rating: 5,
  },
  {
    name: "Matas of the 2-Minute Monologue",
    title: "Timer-respecting citizen",
    quote: "I learned that two minutes is either nothing or an entire lifetime, depending on how prepared you are.",
    rating: 5,
  },
  {
    name: "Matas, Keeper of the Leaderboard",
    title: "Silver rank menace",
    quote: "I came for a quick practice round and stayed because Daniel is only 42 ELO ahead of me.",
    rating: 5,
  },
  {
    name: "Matas with the Big Conclusion",
    title: "Ending sentence collector",
    quote: "The next drill told me to land the final line harder. I now end arguments like doors in a storm.",
    rating: 4,
  },
  {
    name: "Matas the Topic Gambler",
    title: "Mixed category survivor",
    quote: "General, Irish, School, wildcard chaos. The wheel has no mercy, which is exactly why it works.",
    rating: 5,
  },
];

function Rating({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${value} out of 5 rating`}>
      {Array.from({ length: 5 }, (_, index) => (
        <span
          key={index}
          className={[
            "h-1.5 w-5 rounded-sm",
            index < value ? "bg-arena-gold" : "bg-arena-border",
          ].join(" ")}
        />
      ))}
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <article className="w-[280px] shrink-0 rounded-lg border border-arena-border bg-arena-background/90 p-4 sm:w-[340px]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-white">{testimonial.name}</h3>
          <p className="mt-1 text-sm text-arena-textMuted">{testimonial.title}</p>
        </div>
        <Rating value={testimonial.rating} />
      </div>
      <p className="mt-4 text-sm leading-6 text-arena-textMuted">{testimonial.quote}</p>
    </article>
  );
}

export function TestimonialsMarquee() {
  return (
    <section className="overflow-hidden border-y border-arena-border bg-arena-surface py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">Loved by Matas Everywhere</h2>
          <p className="mt-4 text-base leading-7 text-arena-textMuted">
            Every review is from Matas. Is that suspicious? Maybe. Is it memorable? Absolutely.
          </p>
        </div>
      </div>

      <div className="mt-8 group" aria-label="Testimonials from Oratorium users">
        <div className="testimonial-marquee flex w-max gap-4 px-4 group-hover:[animation-play-state:paused] sm:px-6 lg:px-8">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.name} testimonial={testimonial} />
          ))}
          <div className="flex gap-4" aria-hidden="true">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={`${testimonial.name}-duplicate`} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
