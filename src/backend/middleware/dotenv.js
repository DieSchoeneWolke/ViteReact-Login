import * as dotenv from '@dotenvx/dotenvx';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, '../../../.env');

dotenv.config({ path: envPath });

export { dotenv };
