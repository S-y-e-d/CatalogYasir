import "./About.css";

function About() {
  return (
    <main className="about">
      <div className="about__container">
        <header className="about__header">
          <h1>About Us</h1>
          <p>
            Welcome to our store. We believe great clothing doesn't
            have to follow the latest trends.
          </p>
        </header>

        <section className="about__section">
          <h2>Our Story</h2>

          <p>
            What started as a simple appreciation for classic
            clothing grew into a collection of pieces chosen for
            their style, quality, and individuality.
          </p>

          <p>
            We look for clothing that feels distinctive and has a
            sense of history. Whether you're looking for something
            elegant, casual, or simply different, we hope you'll
            find something that catches your eye.
          </p>
        </section>

        <section className="about__section">
          <h2>Our Collection</h2>

          <p>
            Our catalog features a selection of clothing, shoes,
            accessories, and other items. Each product is presented
            with its availability and details so you can easily
            browse what we currently have to offer.
          </p>

          <p>
            Our collection changes over time, so check back
            regularly to discover new additions.
          </p>
        </section>

        <section className="about__section">
          <h2>Get in Touch</h2>

          <p>
            Have a question about an item or want to know more
            about something in our collection?
          </p>

          <p>
            Feel free to get in touch with us. We're happy to help.
          </p>
        </section>
      </div>
    </main>
  );
}

export default About;