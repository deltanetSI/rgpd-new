<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\Employee;
use App\Models\Organization;

class EmployeeContractMailable extends Mailable
{
    use Queueable, SerializesModels;

    public $employee;
    public $organization;
    public $pdfPath;

    /**
     * Create a new message instance.
     */
    public function __construct(Employee $employee, Organization $organization, $pdfPath)
    {
        $this->employee = $employee;
        $this->organization = $organization;
        $this->pdfPath = $pdfPath;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        return $this->subject('Tu cláusula de protección de datos - ' . $this->organization->name)
            ->view('emails.employee_contract')
            ->attach($this->pdfPath, [
                'as' => 'ClausulaProteccionDatos.pdf',
                'mime' => 'application/pdf',
            ]);
    }
} 