const fs = require('fs');

const indexHtml = fs.readFileSync('index.html', 'utf8');
const marqueeHtml = fs.readFileSync('scratch_marquee.html', 'utf8');

// Find the start and end indices of the marquee-content div
const startMarker = '<div class="marquee-content flex gap-4 animate-marquee-left">';
const startIndex = indexHtml.indexOf(startMarker);

// Find the closing </div> of the marquee-content by matching the indentation
// We know it ends exactly before "</div>\n        </div>\n      </section>"
const endIndexSearchPattern = '          </div>\n        </div>\n      </section>';
const endIndex = indexHtml.indexOf(endIndexSearchPattern);

if (startIndex === -1 || endIndex === -1) {
  console.error("Could not find boundaries!");
  process.exit(1);
}

// Extract the pre and post content
const preContent = indexHtml.substring(0, startIndex);
// the endIndex starts exactly at "          </div>"
const postContent = indexHtml.substring(endIndex + 16); // 16 is the length of "          </div>"

const newHtml = preContent + marqueeHtml + postContent;

fs.writeFileSync('index.html', newHtml);
console.log('Successfully injected marquee HTML into index.html');
