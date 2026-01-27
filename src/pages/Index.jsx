import GradientButton from "../components/GradientButton";
import { TrendingDown, Bell, DollarSign, LineChart } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-foreground">PriceTracker</span>
          </div>
          <div className="flex items-center gap-3">
          <Link to="/login">
            <GradientButton variant="ghost">Login</GradientButton>
            </Link>

            <Link to="/signup">
                <GradientButton>Sign Up</GradientButton>
            </Link>

          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Track Prices, Save Money
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Never miss a deal again. Get instant alerts when prices drop on products you love.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <GradientButton size="lg">Get Started Free</GradientButton>
            <GradientButton size="lg" variant="outline">Learn More</GradientButton>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4">
              <Bell className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Instant Alerts
            </h3>
            <p className="text-muted-foreground">
              Get notified the moment prices drop on your favorite products
            </p>
          </div>

          <div className="text-center p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4">
              <LineChart className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Price History
            </h3>
            <p className="text-muted-foreground">
              View detailed price trends and make informed buying decisions
            </p>
          </div>

          <div className="text-center p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4">
              <DollarSign className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Save Money
            </h3>
            <p className="text-muted-foreground">
              Track unlimited products and save hundreds on your purchases
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
