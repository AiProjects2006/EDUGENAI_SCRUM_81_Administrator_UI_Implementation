import {
    Eye
} from "lucide-react";

import "./ModerationTable.css";

function ModerationTable({
                             content,
                             selectedContent,
                             onSelect
                         }) {
    return (
        <div className="moderation-table-wrapper">

            <table className="moderation-table">

                <thead>
                <tr>
                    <th>CONTENT</th>
                    <th>TYPE</th>
                    <th>SUBJECT</th>
                    <th>DATE</th>
                    <th>STATUS</th>
                </tr>
                </thead>

                <tbody>

                {content.length === 0 ? (

                    <tr>
                        <td
                            colSpan="6"
                            className="no-content"
                        >
                            No content found
                        </td>
                    </tr>

                ) : (

                    content.map((item) => (

                        <tr
                            key={item.id}
                            className={
                                selectedContent?.id === item.id
                                    ? "selected-row"
                                    : ""
                            }
                            onClick={() => onSelect(item)}
                        >

                            <td>
                                <div className="content-title">
                                    {item.title}
                                </div>

                                <div className="content-id">
                                    ID: {item.id}
                                </div>
                            </td>

                            <td>
                                    <span
                                        className={`content-type ${item.type === "AI Activity"
                                            ? "ai-type"
                                            : "uploaded-type"
                                        }`}
                                    >
                                        {item.type}
                                    </span>
                            </td>

                            <td>
                                {item.subject}
                            </td>

                            <td>
                                {item.date}
                            </td>

                            <td>
                                    <span
                                        className={`moderation-status ${item.status.toLowerCase()}`}
                                    >
                                        {item.status}
                                    </span>
                            </td>

                        </tr>

                    ))

                )}

                </tbody>

            </table>

        </div>
    );
}

export default ModerationTable;