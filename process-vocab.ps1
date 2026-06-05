function Get-TermId {
    param($term)
    $id = $term.ToLower() -replace '[^\w\s-]', '' -replace '\s+', '-'
    return $id
}

function NeedsVocabCSS {
    param($content)
    return $content -notmatch '\.vocab\s*\{'
}

function AddVocabCSS {
    param($content)
    if ($content -match '(\.vocab-table\s*th\s*\{)') {
        $css = '.vocab { color: #3b82f6; font-weight: 500; }'
        $content = $content -replace '(\.vocab-table\s*th\s*\{)', "$css`n    .vocab-table th {"
    }
    return $content
}

$module6 = "C:\Users\badhi\OneDrive\Documents\GitHub\newsite\products\courses\lessons\module6\chapter-6-creating-headings-and-paragraphs.html"
$module7dir = "C:\Users\badhi\OneDrive\Documents\GitHub\newsite\products\courses\lessons\module7\"
$files = @($module6) + (Get-ChildItem -Path $module7dir -Filter "chapter-*.html" | Sort-Object Name | Select-Object -ExpandProperty FullName)

$totalHighlights = @{}
$totalTableUpgrades = 0

foreach ($file in $files) {
    $fileName = Split-Path $file -Leaf
    Write-Host "Processing $fileName ... " -NoNewline

    $content = [System.IO.File]::ReadAllText($file)
    $original = $content

    # 1. Add .vocab CSS if missing
    if (NeedsVocabCSS -content $content) {
        $content = AddVocabCSS -content $content
        Write-Host "CSS+ " -NoNewline
    }

    # 2. Upgrade vocab table rows
    $upgradedRows = 0
    $termToId = @{}   # maps term text -> generated ID

    # Find the vocabulary tbody to work within
    $tbodyStart = $content.IndexOf('<tbody class="text-theme-muted">')
    $tbodyEnd = $content.IndexOf('</tbody>', $tbodyStart)

    if ($tbodyStart -ge 0 -and $tbodyEnd -ge 0) {
        $beforeTbody = $content.Substring(0, $tbodyStart)
        $tbodyContent = $content.Substring($tbodyStart, $tbodyEnd - $tbodyStart + 8)
        $afterTbody = $content.Substring($tbodyEnd + 8)

        # Find all rows in the tbody
        $rowPattern = '<tr><td>([^<]+)</td><td>([^<]+)</td></tr>'
        $rowMatches = [regex]::Matches($tbodyContent, $rowPattern)

        if ($rowMatches.Count -gt 0) {
            foreach ($rowMatch in $rowMatches) {
                $oldRow = $rowMatch.Value
                $term = $rowMatch.Groups[1].Value
                $definition = $rowMatch.Groups[2].Value
                $id = Get-TermId -term $term
                $termToId[$term] = $id

                $newRow = '<tr id="vocab-' + $id + '"><td><span class="vocab cursor-pointer" onclick="scrollToVocabulary(''' + $id + ''')">' + $term + '</span></td><td>' + $definition + '</td></tr>'
                $tbodyContent = $tbodyContent -replace [regex]::Escape($oldRow), $newRow
                $upgradedRows++
            }

            $content = $beforeTbody + $tbodyContent + $afterTbody
            Write-Host "Table $upgradedRows rows " -NoNewline
        }
    }

    # 3. Add body text highlighting
    if ($termToId.Count -gt 0) {
        # Find main content boundaries
        $mainStart = $content.IndexOf('<main')
        $vocabPos = $content.IndexOf('id="vocabulary"')
        $sectionStart = if ($vocabPos -ge 0) { $content.LastIndexOf('<section', $vocabPos) } else { -1 }
        if ($sectionStart -lt $mainStart) { $sectionStart = if ($vocabPos -ge 0) { $vocabPos } else { $content.Length } }

        if ($mainStart -ge 0) {
            $beforeMain = $content.Substring(0, $mainStart)
            $mainContent = $content.Substring($mainStart, $sectionStart - $mainStart)
            $afterMain = $content.Substring($sectionStart)

            # Build patterns for all terms
            $idLookup = @{}
            $rawPatterns = @()

            foreach ($kv in $termToId.GetEnumerator()) {
                $term = $kv.Key
                $id = $kv.Value

                $baseLower = $term.ToLower()
                $idLookup[$baseLower] = $id
                $idLookup[$baseLower + 's'] = $id
                $idLookup[$baseLower + "'s"] = $id

                if ($baseLower -match 'y$') {
                    $idLookup[$baseLower -replace 'y$', 'ies'] = $id
                }

                $words = $baseLower -split '\s+'
                $escapedWords = $words | ForEach-Object { [regex]::Escape($_) }
                $patternCore = $escapedWords -join '\s+'
                $lastWord = $words[-1]
                $pluralSuffix = if ($lastWord -match '\w$') { '(?:s|''s)?' } else { '' }
                $rawPatterns += '(?<!\w)(' + $patternCore + $pluralSuffix + ')(?!\w)'

                # y->ies for single word
                if ($words.Count -eq 1 -and $baseLower -match 'y$') {
                    $iesWord = $baseLower -replace 'y$', 'ies'
                    $rawPatterns += '(?<!\w)(' + [regex]::Escape($iesWord) + ')(?!\w)'
                }
                # y->ies for multi-word last word
                if ($words.Count -gt 1 -and $lastWord -match 'y$') {
                    $parts = $words[0..($words.Count-2)] + ($lastWord -replace 'y$', 'ies')
                    $rawPatterns += '(?<!\w)(' + (($parts | ForEach-Object { [regex]::Escape($_) }) -join '\s+') + ')(?!\w)'
                }
            }

            $rawPatterns = $rawPatterns | Sort-Object Length -Descending
            $combinedPattern = '(?i)(' + ($rawPatterns -join '|') + ')'

            $eval = {
                param($m)
                $matchedText = $m.Value
                $pos = $m.Index
                $prefix = $mainContent.Substring(0, $pos)

                # Skip if inside HTML tag
                $lastOpen = $prefix.LastIndexOf('<')
                $lastClose = $prefix.LastIndexOf('>')
                if ($lastOpen -gt $lastClose) { return $matchedText }

                # Skip if inside existing vocab span
                $openV = [regex]::Matches($prefix, '<span class="vocab[^"]*"[^>]*>').Count
                $closeV = [regex]::Matches($prefix, '</span>').Count
                if ($openV -gt $closeV) { return $matchedText }

                # Skip if inside <a> tag
                $openA = [regex]::Matches($prefix, '<a\s').Count
                $closeA = [regex]::Matches($prefix, '</a>').Count
                if ($openA -gt $closeA) { return $matchedText }

                $key = $matchedText.ToLower()
                if ($idLookup.ContainsKey($key)) {
                    $vocabId = $idLookup[$key]
                    return '<span class="vocab cursor-pointer" onclick="scrollToVocabulary(''' + $vocabId + ''')">' + $matchedText + '</span>'
                }
                return $matchedText
            }

            $newMain = [regex]::Replace($mainContent, $combinedPattern, $eval)
            $content = $beforeMain + $newMain + $afterMain

            # Count highlights by counting vocab spans added
            $hCount = [regex]::Matches($newMain, '<span class="vocab cursor-pointer" onclick="scrollToVocabulary').Count
            Write-Host "$hCount highlights " -NoNewline
            $totalHighlights[$fileName] = $hCount
        }
    }

    # Write back if changed
    if ($content -ne $original) {
        [System.IO.File]::WriteAllText($file, $content)
        Write-Host "DONE"
    } else {
        Write-Host "NO CHANGE"
    }
}

Write-Host ""
Write-Host "=== SUMMARY ==="
$total = 0
foreach ($kv in $totalHighlights.GetEnumerator() | Sort-Object Name) {
    Write-Host ("  " + $kv.Name + ": " + $kv.Value + " highlights")
    $total += $kv.Value
}
Write-Host ""
Write-Host "Total body highlights: $total"
