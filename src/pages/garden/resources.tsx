import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useGardenProfile } from '@/hooks/use-garden-profile'

const SEED_COMPANIES = [
  { name: 'Baker Creek Heirloom Seeds', url: 'rareseeds.com', specialty: 'Largest heirloom selection in the US. 1,500+ rare, open-pollinated varieties. Family-owned.', focus: 'Heirloom' },
  { name: 'Seed Savers Exchange', url: 'seedsavers.org', specialty: 'Non-profit dedicated to saving heirloom seeds. Members can access 20,000+ varieties through their network.', focus: 'Preservation' },
  { name: 'Southern Exposure Seed Exchange', url: 'southernexposure.com', specialty: 'Southeast-adapted varieties. Focus on heat-tolerant and open-pollinated seeds for southern climates.', focus: 'Regional' },
  { name: 'High Mowing Organic Seeds', url: 'highmowingseeds.com', specialty: 'USDA-certified organic. Excellent cold-climate varieties. Based in Vermont.', focus: 'Organic' },
  { name: 'Johnny\'s Selected Seeds', url: 'johnnyseeds.com', specialty: 'Professional-grade catalog with excellent trial data. Great for high-yield commercial varieties too.', focus: 'Performance' },
  { name: 'Territorial Seed Company', url: 'territorialseed.com', specialty: 'Pacific Northwest focus. Excellent short-season varieties. Good for cool, wet climates.', focus: 'Regional' },
  { name: 'Fedco Seeds', url: 'fedcoseeds.com', specialty: 'Worker-owned co-op. Open-pollinated focus, excellent Northern cold-climate varieties.', focus: 'Cold Climate' },
  { name: 'Native Seeds/SEARCH', url: 'nativeseeds.org', specialty: 'Drought-tolerant, Southwest-adapted heritage seeds. Focus on Native American food crops.', focus: 'Southwest/Drought' },
]

const BOOKS = [
  {
    category: 'Gardening Foundations',
    books: [
      { title: 'The Market Gardener', author: 'Jean-Martin Fortier', desc: 'High-yield, low-machinery market garden methods. Best for serious food production.' },
      { title: 'Gaia\'s Garden', author: 'Toby Hemenway', desc: 'Permaculture at home scale. The definitive intro to food forests and integrated systems.' },
      { title: 'The Vegetable Gardener\'s Bible', author: 'Edward C. Smith', desc: 'W-O-R-D method: wide rows, organic methods, raised beds, deep soil. Excellent beginner reference.' },
      { title: 'Eliot Coleman\'s Four-Season Harvest', author: 'Eliot Coleman', desc: 'Year-round vegetable growing in cold climates. Season extension techniques from a master.' },
    ],
  },
  {
    category: 'Soil & Composting',
    books: [
      { title: 'Teaming with Microbes', author: 'Jeff Lowenfels', desc: 'The soil food web explained. Understanding why organic matter matters.' },
      { title: 'The Rodale Book of Composting', author: 'Deborah Martin (ed.)', desc: 'Comprehensive guide to every composting method.' },
    ],
  },
  {
    category: 'Preservation & Fermentation',
    books: [
      { title: 'Ball Complete Book of Home Preserving', author: 'Judi Kingry & Lauren Devine', desc: 'The authoritative canning reference. 400 tested recipes. Always consult for safe ratios.' },
      { title: 'The Art of Fermentation', author: 'Sandor Katz', desc: 'The definitive fermentation encyclopedia. Every culture, every vegetable, complete guide.' },
      { title: 'Nourishing Traditions', author: 'Sally Fallon', desc: 'Traditional food preparation including lacto-fermentation, bone broth, and nutrient-dense cooking.' },
    ],
  },
  {
    category: 'Homestead Animals',
    books: [
      { title: 'The Family Cow', author: 'Dirk van Loon', desc: 'The classic guide to keeping a family dairy cow. Simple, practical, timeless.' },
      { title: 'Keeping a Family Cow', author: 'Joann Grohman', desc: 'Detailed, conversational guide for small-scale dairy cow management.' },
      { title: 'Storey\'s Guide to Raising series', author: 'Various (Storey Publishing)', desc: 'Individual volumes for chickens, rabbits, pigs, ducks, goats, bees, dairy cattle. Each is definitive.' },
      { title: 'Aquaponic Gardening', author: 'Sylvia Bernstein', desc: 'Complete guide to home-scale aquaponics systems. Fish + plants in one closed loop.' },
    ],
  },
  {
    category: 'Holistic Homesteading',
    books: [
      { title: 'You Can Farm', author: 'Joel Salatin', desc: 'Inspirational and practical guide to starting a profitable small farm using nature\'s systems.' },
      { title: 'Folks, This Ain\'t Normal', author: 'Joel Salatin', desc: 'The Polyface Farm philosophy. Why industrial food is broken and what to do about it.' },
      { title: 'The Encyclopedia of Country Living', author: 'Carla Emery', desc: '900+ pages. The homesteading Bible. Everything from butchering to baking bread from scratch.' },
      { title: 'Seed to Seed', author: 'Suzanne Ashworth', desc: 'The definitive seed saving reference. Every crop, detailed and specific.' },
    ],
  },
]

const ONLINE_RESOURCES = [
  { name: 'ATTRA — National Sustainable Agriculture Information Service', url: 'attra.ncat.org', desc: 'Free publications on everything from aquaponics to cover crops to livestock. Government-funded, practical, peer-reviewed.' },
  { name: 'SARE — Sustainable Agriculture Research & Education', url: 'sare.org', desc: 'Research-based guides for sustainable farming and homesteading. Free downloads.' },
  { name: 'ARBA — American Rabbit Breeders Association', url: 'arba.net', desc: 'Breed standards, raising guides, and breeder directory for rabbits.' },
  { name: 'National Center for Home Food Preservation', url: 'nchfp.uga.edu', desc: 'USDA-tested canning and preservation recipes. The authority on safe food preservation.' },
  { name: 'American Beekeeping Federation', url: 'abfnet.org', desc: 'Beekeeping resources, local club finder, and beginner guides.' },
  { name: 'USDA Plant Hardiness Zone Map', url: 'planthardiness.ars.usda.gov', desc: 'Look up your official hardiness zone by ZIP code.' },
  { name: 'Old Farmer\'s Almanac', url: 'almanac.com', desc: 'Planting calendars by ZIP code, frost date lookup, moon planting guides.' },
]

export default function ResourcesPage() {
  const { profile } = useGardenProfile()

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Local & Online Resources</h1>
        <p className="mt-1 text-muted-foreground">
          The best resources are often free — your county extension office provides soil testing, local planting guides, and expert advice at no cost.
        </p>
      </div>

      {/* Extension office */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-green-800">Your County Cooperative Extension Office</CardTitle>
          <CardDescription>Every county in the US has one — and it's almost entirely free</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-green-700 space-y-2">
          <p>Find yours: <strong>extension.org</strong> → enter your state and county</p>
          <div className="grid sm:grid-cols-2 gap-2">
            <div>
              <p className="font-medium mb-1">Free services typically include:</p>
              <ul className="space-y-0.5 text-xs">
                <li>• Soil testing ($5–20 for full nutrient + pH panel)</li>
                <li>• Local planting calendar by zip code</li>
                <li>• Master Gardener volunteers for questions</li>
                <li>• Pest and disease identification</li>
                <li>• Livestock and poultry guides</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-1">Also look for:</p>
              <ul className="space-y-0.5 text-xs">
                <li>• Local seed swaps (often free)</li>
                <li>• 4-H youth agriculture programs</li>
                <li>• Master Gardener free workshops</li>
                <li>• Small farm/homestead programs</li>
                <li>• Local variety trials (what actually grows in your area)</li>
              </ul>
            </div>
          </div>
          {profile?.zip_code && (
            <p className="text-xs">Look up your local office: <strong>extension.org</strong> and search for ZIP {profile.zip_code}</p>
          )}
        </CardContent>
      </Card>

      {/* Seed companies */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Trusted Seed Sources</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {SEED_COMPANIES.map((s) => (
            <Card key={s.name}>
              <CardContent className="pt-3 pb-3">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="font-medium text-sm">{s.name}</p>
                  <Badge variant="secondary" className="text-xs shrink-0">{s.focus}</Badge>
                </div>
                <p className="text-xs text-primary mb-1">{s.url}</p>
                <p className="text-xs text-muted-foreground">{s.specialty}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Books */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Essential Reading</h2>
        <div className="space-y-4">
          {BOOKS.map((cat) => (
            <div key={cat.category}>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">{cat.category.toUpperCase()}</h3>
              <div className="grid gap-2 sm:grid-cols-2">
                {cat.books.map((b) => (
                  <Card key={b.title}>
                    <CardContent className="pt-3 pb-3">
                      <p className="font-medium text-sm">{b.title}</p>
                      <p className="text-xs text-muted-foreground mb-1">{b.author}</p>
                      <p className="text-xs text-muted-foreground">{b.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Online resources */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Online Resources</h2>
        <div className="space-y-2">
          {ONLINE_RESOURCES.map((r) => (
            <Card key={r.name}>
              <CardContent className="py-3 flex gap-4 items-start">
                <div className="flex-1">
                  <p className="font-medium text-sm">{r.name}</p>
                  <p className="text-xs text-primary">{r.url}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{r.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Local tips */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Finding Local Resources</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-1">
          <p>• <strong>Seed swaps:</strong> Search Facebook groups for "[your county] seed swap" or "[your state] homesteaders"</p>
          <p>• <strong>Manure/compost:</strong> Local farms, horse stables, and chicken operations often give it away free for pickup</p>
          <p>• <strong>Wood chips:</strong> ChipDrop.com — arborists deliver free wood chips to your address (excellent mulch)</p>
          <p>• <strong>Livestock:</strong> Check Craigslist farm & garden, local livestock auctions, and breed-specific Facebook groups</p>
          <p>• <strong>Feed stores:</strong> Your local Tractor Supply or independent feed store carries most animal supplies and often has community boards with local resources</p>
          <p>• <strong>Community:</strong> Local homesteading Facebook groups are invaluable for regional-specific advice and connecting with neighbors doing the same thing</p>
        </CardContent>
      </Card>
    </div>
  )
}
