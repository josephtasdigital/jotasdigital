/**
 * PartnerOffers
 * -------------
 * Independent, modular placeholder section rendered below the Services Grid.
 * Internal content, styling, and data are intentionally minimal — they will
 * be populated later. Do NOT couple this component to GTM, cookie consent,
 * or the Services Grid logic.
 */
const PartnerOffers = () => {
  return (
    <section
      id="partner-offers"
      className="border-t border-border"
      data-gtm="partner-offers-section"
    >
      <div className="section-container">
        <span className="section-label">// Partners</span>
        <h2 className="section-title">Partner Offers</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-border bg-card/30 p-6 min-h-[180px] flex items-center justify-center text-muted-foreground font-body text-sm"
            >
              Placeholder card
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnerOffers;
