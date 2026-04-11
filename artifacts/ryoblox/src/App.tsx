import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Analytics } from "@vercel/analytics/react";
import ConstellationCanvas from "@/components/ConstellationCanvas";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import Privacy from "@/pages/Privacy";
import Tos from "@/pages/Tos";
import Instructions from "@/pages/Setup";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/setup" component={Instructions} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/tos" component={Tos} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <ConstellationCanvas />
        <Navbar />
        <Router />
        <Footer />
        <Analytics />
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
