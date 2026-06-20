const YOUTUBE_VIDEO_ID_PATTERN = /^[A-Za-z0-9_-]+$/;

function hasProtocol(value: string) {
  return /^[a-z][a-z\d+.-]*:/i.test(value);
}

function isYouTubeHost(hostname: string) {
  const host = hostname.toLowerCase();
  return host === 'youtube.com' || host.endsWith('.youtube.com') || host === 'youtube-nocookie.com' || host.endsWith('.youtube-nocookie.com');
}

function isShortYouTubeHost(hostname: string) {
  const host = hostname.toLowerCase();
  return host === 'youtu.be' || host.endsWith('.youtu.be');
}

function cleanVideoId(value: string | null | undefined) {
  const videoId = value?.trim().replace(/[?&#].*$/, '') ?? '';
  return YOUTUBE_VIDEO_ID_PATTERN.test(videoId) ? videoId : '';
}

function parseTimestamp(value: string | null) {
  if (!value) return null;
  const normalized = value.trim().toLowerCase();
  if (!normalized) return null;

  if (/^\d+$/.test(normalized)) {
    return Number(normalized);
  }

  if (/^\d+:\d{1,2}(?::\d{1,2})?$/.test(normalized)) {
    const parts = normalized.split(':').map(Number);
    const seconds = parts.reduce((total, part) => total * 60 + part, 0);
    return Number.isFinite(seconds) ? seconds : null;
  }

  const match = normalized.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?$/);
  if (!match || !match[0]) return null;

  const hours = Number(match[1] ?? 0);
  const minutes = Number(match[2] ?? 0);
  const seconds = Number(match[3] ?? 0);
  const total = hours * 3600 + minutes * 60 + seconds;

  return total > 0 ? total : null;
}

function getStartSeconds(url: URL) {
  const hashParams = new URLSearchParams(url.hash.replace(/^#/, ''));
  return parseTimestamp(url.searchParams.get('start')) ?? parseTimestamp(url.searchParams.get('t')) ?? parseTimestamp(hashParams.get('t'));
}

function getYouTubeVideoId(url: URL) {
  const pathParts = url.pathname.split('/').filter(Boolean);

  if (isShortYouTubeHost(url.hostname)) {
    return cleanVideoId(pathParts[0]);
  }

  if (!isYouTubeHost(url.hostname)) {
    return '';
  }

  const [firstPart, secondPart] = pathParts;
  if (['embed', 'shorts', 'live', 'v'].includes(firstPart)) {
    return cleanVideoId(secondPart);
  }

  return cleanVideoId(url.searchParams.get('v'));
}

export function normalizeVideoEmbedUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return '';

  let url: URL;
  try {
    url = new URL(hasProtocol(trimmed) ? trimmed : `https://${trimmed}`);
  } catch {
    return trimmed;
  }

  const isYouTubeUrl = isYouTubeHost(url.hostname) || isShortYouTubeHost(url.hostname);
  if (!isYouTubeUrl) return trimmed;

  const videoId = getYouTubeVideoId(url);
  if (!videoId) return '';

  const embedUrl = new URL(`https://www.youtube.com/embed/${videoId}`);
  const startSeconds = getStartSeconds(url);
  if (startSeconds) {
    embedUrl.searchParams.set('start', String(startSeconds));
  }

  return embedUrl.toString();
}
