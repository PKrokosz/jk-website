export const metadata = {
  title: "About"
};

export default function AboutPage() {
  return (
    <main className="page" aria-labelledby="about-heading">
      <section className="section" role="presentation">
        <div className="container">
          <h1 id="about-heading">O pracowni</h1>
          <p>Historia marki, rzemiosło oraz filozofia projektowa pojawią się w tej sekcji.</p>
        </div>
      </section>
    </main>
  );
}
