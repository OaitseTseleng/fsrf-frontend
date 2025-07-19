export default function ChooseUs() {
    return (
      <section id="chooseus" className="py-16 text-center">
        <h3 className="text-2xl font-semibold mb-8">Why Choose Us?</h3>
        <div className="grid md:grid-cols-3 gap-8 px-4">
          <div>
            <h4 className="font-bold">Fresh Ingredients</h4>
            <p>We use only the finest ingredients to bake our cookies.</p>
          </div>
          <div>
            <h4 className="font-bold">Fast Delivery</h4>
            <p>Get your cookies delivered fresh within 24 hours.</p>
          </div>
          <div>
            <h4 className="font-bold">Gift Packaging</h4>
            <p>Perfect for birthdays, holidays, or any sweet moment.</p>
          </div>
        </div>
      </section>
    );
  }