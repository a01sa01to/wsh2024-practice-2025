type Params = {
  query: string;
  target: string;
};

// ひらがな・カタカナ・半角・全角を区別せずに文字列が含まれているかを調べる
export function isContains({ query, target }: Params): boolean {
  const collator = new Intl.Collator("ja", { sensitivity: "accent", usage: "search" });
  for (let offset = 0; offset <= target.length - query.length; offset++) {
    const targetPart = target.slice(offset, offset + query.length);
    if (collator.compare(targetPart, query) !== 0) continue
    return true;
  }
  return false;
}
