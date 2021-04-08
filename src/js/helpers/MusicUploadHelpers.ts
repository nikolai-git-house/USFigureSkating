export class MusicUploadHelpers {
    static validateSelectedFile(file: File): { is_valid: boolean, error: string } {
        let valid_mime_types = [
            "audio/mp3",
            "audio/mpeg",
            "audio/x-mpeg",
            "video/mpeg",
            "video/x-mpeg",
            "audio/mpeg3",
            "audio/x-mpeg-3",
            "audio/mpg"
        ];
        if (valid_mime_types.indexOf(file.type) === -1) {
            return {
                is_valid: false,
                error: "File must be an mp3 file."
            };
        }
        let max_mb = 12;
        if (file.size > max_mb * 1000 * 1000) {
            let file_size_in_mb = Math.round((file.size / (1000 * 1000)) * 10) / 10;
            return {
                is_valid: false,
                error: "File must be " + max_mb + "mb or smaller.  Selected file is " + file_size_in_mb + "mb."
            };
        }


        return {
            is_valid: true,
            error: ""
        }
    }

    static pruneFileExtension(file_name_with_extension: string): string {
        let file_name_segents = file_name_with_extension.split('.');
        file_name_segents.pop();
        return file_name_segents.join();
    }
}