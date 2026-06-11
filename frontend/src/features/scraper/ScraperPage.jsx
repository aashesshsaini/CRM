import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Search, Loader2, CheckCircle2, AlertCircle, Copy, Database, XCircle, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'
import { scrapeGoogleMaps } from '../../services/scraperService.js'
import { CATEGORY_OPTIONS } from '../../config/constants.js'
import Button from '../../components/common/Button.jsx'
import Input from '../../components/common/Input.jsx'
import Select from '../../components/common/Select.jsx'

function ResultCard({ icon: Icon, label, value, color }) {
  const colors = {
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    green: 'bg-green-50 text-green-700 border-green-100',
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-100',
    red: 'bg-red-50 text-red-700 border-red-100',
  }
  return (
    <div className={`rounded-xl border p-4 flex items-center gap-3 ${colors[color]}`}>
      <Icon className="w-5 h-5 shrink-0" />
      <div>
        <p className="text-xs font-medium opacity-70">{label}</p>
        <p className="text-2xl font-bold">{value ?? 0}</p>
      </div>
    </div>
  )
}

export default function ScraperPage() {
  const [result, setResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: { maxLeads: 100 },
  })

  const category = watch('category')
  const city = watch('city')
  const generatedQuery = category && city ? `${category} in ${city}` : ''

  const onSubmit = async (values) => {
    const query = `${values.category} in ${values.city}`
    setIsLoading(true)
    setResult(null)
    try {
      const data = await scrapeGoogleMaps(query, Number(values.maxLeads))
      setResult(data)
      toast.success(`Scraping complete! ${data.inserted ?? 0} new leads added.`)
    } catch (err) {
      toast.error(err.message || 'Scraping failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="page-title">Lead Scraper</h2>
        <p className="text-sm text-gray-500 mt-1">
          Pull fresh leads from Google Maps by searching for any business category in any city.
        </p>
      </div>

      {/* Form card */}
      <div className="card p-6 space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
          <Search className="w-4 h-4 text-indigo-500" />
          <span className="text-sm font-semibold text-gray-800">Configure Search</span>
        </div>

        <Select
          label="Business Category"
          options={CATEGORY_OPTIONS.map(c => ({ value: c, label: c.charAt(0).toUpperCase() + c.slice(1) }))}
          placeholder="Select a category"
          required
          {...register('category', { required: 'Category is required' })}
          error={errors.category?.message}
        />

        <Input
          label="City"
          placeholder="e.g. Muzaffarnagar, Delhi, Lucknow"
          required
          {...register('city', { required: 'City is required' })}
          error={errors.city?.message}
        />

        <Input
          label="Max Leads"
          type="number"
          required
          {...register('maxLeads', {
            required: 'Max leads is required',
            min: { value: 1, message: 'Minimum 1' },
            max: { value: 500, message: 'Maximum 500 per run' },
          })}
          error={errors.maxLeads?.message}
          helperText="Maximum leads to scrape in this run (1–500)"
        />

        {/* Preview */}
        {generatedQuery && (
          <div className="flex items-center gap-2 px-3 py-2.5 bg-indigo-50 rounded-lg border border-indigo-100">
            <Search className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span className="text-sm text-indigo-700 font-medium">Query: </span>
            <span className="text-sm text-indigo-600 font-mono">&quot;{generatedQuery}&quot;</span>
          </div>
        )}

        <Button
          className="w-full justify-center"
          size="lg"
          loading={isLoading}
          onClick={handleSubmit(onSubmit)}
          icon={Search}
        >
          {isLoading ? 'Scraping leads...' : 'Scrape Leads'}
        </Button>

        {isLoading && (
          <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
            <Loader2 className="w-5 h-5 text-amber-500 animate-spin shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-800">Scraping in progress</p>
              <p className="text-xs text-amber-600 mt-0.5">
                This may take 30–120 seconds depending on the number of results. Please wait.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Results card */}
      {result && (
        <div className="card p-6 space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <span className="text-sm font-semibold text-gray-800">Scraping Results</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <ResultCard
              icon={Search}
              label="Total Scraped"
              value={result.total ?? result.scraped}
              color="indigo"
            />
            <ResultCard
              icon={CheckCircle2}
              label="Inserted"
              value={result.inserted}
              color="green"
            />
            <ResultCard
              icon={AlertTriangle}
              label="Duplicates"
              value={result.duplicates}
              color="yellow"
            />
            <ResultCard
              icon={XCircle}
              label="Failed"
              value={result.failed}
              color="red"
            />
          </div>

          {result.message && (
            <p className="text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
              {result.message}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
