const BlogPost = require('../models/BlogPost');
const Service = require('../models/Service');
const ESGReport = require('../models/ESGReport');
const Job = require('../models/Job');
const TeamMember = require('../models/TeamMember');

// MongoDB $text search: uses the weighted text indexes on each model
// (see models/*.js) for real relevance-ranked full-text search — results
// are sorted by textScore, so a match in a title outranks one buried in
// a description, and MongoDB's built-in stemming means "monitoring"
// matches "monitor"/"monitored" too, unlike the old plain-regex search.
//
// $text requires whole-word tokens though (it won't match "moni" against
// "monitoring"), which breaks the common case of someone still typing a
// partial word. So each model is queried both ways in parallel and the
// two result sets are merged, text-search hits first (they're better
// matches) followed by any additional regex-only partial matches, with
// duplicates removed by _id.
const textSearch = (Model, filter, q, limit, projection) =>
  Model.find({ ...filter, $text: { $search: q } }, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } })
    .limit(limit)
    .select(projection)
    .lean()
    .catch(() => []); // no text index yet, or query too short for $text — fall through to regex

const regexSearch = (Model, filter, limit, projection) =>
  Model.find(filter).limit(limit).select(projection).lean();

const mergeUnique = (primary, secondary, limit) => {
  const seen = new Set(primary.map((d) => String(d._id)));
  const merged = [...primary];
  for (const doc of secondary) {
    if (merged.length >= limit) break;
    if (!seen.has(String(doc._id))) {
      seen.add(String(doc._id));
      merged.push(doc);
    }
  }
  return merged;
};

exports.globalSearch = async (q, limit = 10) => {
  if (!q || q.trim().length < 2) throw new Error('Search query must be at least 2 characters');
  const term = q.trim();
  limit = Math.min(Math.max(Number(limit) || 10, 1), 50);
  const regex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'); // escaped — a raw user string going straight into RegExp() is a ReDoS/injection risk otherwise

  const [
    blogsText, blogsRegex,
    servicesText, servicesRegex,
    esgResults,
    jobResults,
    teamText, teamRegex,
  ] = await Promise.all([
    textSearch(BlogPost, { isPublished: true }, term, limit, 'title slug excerpt coverImage category publishedAt'),
    regexSearch(BlogPost, { isPublished: true, $or: [{ title: regex }, { excerpt: regex }, { content: regex }, { tags: regex }] }, limit, 'title slug excerpt coverImage category publishedAt'),
    textSearch(Service, { isActive: true }, term, limit, 'title slug shortDescription icon category'),
    regexSearch(Service, { isActive: true, $or: [{ title: regex }, { shortDescription: regex }, { fullDescription: regex }] }, limit, 'title slug shortDescription icon category'),
    // ESG/Jobs don't have text indexes yet — regex only, same as before.
    regexSearch(ESGReport, { isPublished: true, $or: [{ title: regex }, { description: regex }, { content: regex }] }, limit, 'title type description coverImage publishedAt'),
    regexSearch(Job, { isActive: true, $or: [{ title: regex }, { description: regex }] }, limit, 'title slug department location type'),
    textSearch(TeamMember, { isActive: true }, term, limit, 'name role title image department'),
    regexSearch(TeamMember, { isActive: true, $or: [{ name: regex }, { role: regex }, { bio: regex }] }, limit, 'name role title image department'),
  ]);

  const blogs = mergeUnique(blogsText, blogsRegex, limit);
  const services = mergeUnique(servicesText, servicesRegex, limit);
  const team = mergeUnique(teamText, teamRegex, limit);

  return {
    blogs, services, esg: esgResults, jobs: jobResults, team,
    total: blogs.length + services.length + esgResults.length + jobResults.length + team.length,
  };
};
